import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { invokeLLM } from '../_core/llm';
import { TRPCError } from '@trpc/server';
import { searchDuckDuckGo } from '../utils/search';

const searchQuerySchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  language: z.enum(['ar', 'en']).default('ar'),
  category: z.string().optional(),
});

interface FactoryVerificationResult {
  name: string;
  type: 'direct_manufacturer' | 'trader' | 'commercial_company' | 'unknown';
  confidence: number; // 0-100
  reasoning: string;
  isDirectFactory: boolean;
  source?: string;
}

interface SearchResult {
  query: string;
  language: string;
  results: FactoryVerificationResult[];
  recommendations: string[];
}

export const aiAgentRouter = router({
  // Search for factories with real-time AI verification
  searchFactories: publicProcedure
    .input(searchQuerySchema)
    .mutation(async ({ input }): Promise<SearchResult> => {
      console.log(`[AI Agent] Starting search for: "${input.query}" in ${input.language}`);
      
      try {
        // 1. Perform real-time search using DuckDuckGo (completely free)
        const searchQuery = `${input.query} ${input.category || ''} factory manufacturer China supplier`;
        const searchResults = await searchDuckDuckGo(searchQuery);
        
        console.log(`[AI Agent] DuckDuckGo returned ${searchResults.length} results`);

        // Build search context for LLM
        let searchContext = '';
        if (searchResults.length > 0) {
          searchContext = searchResults.map((r, i) => 
            `Result ${i+1}:
Title: ${r.title}
Link: ${r.link}
Snippet: ${r.snippet}`
          ).join('\n\n');
        } else {
          searchContext = 'No search results were found. Please provide general guidance based on the query.';
        }

        // 2. Use LLM to analyze search results and identify real factories
        const systemPrompt = input.language === 'ar'
          ? `أنت محقق ذكي متخصص في البحث عن المصانع الصينية المباشرة. مهمتك هي تحليل نتائج البحث وتحديد المصانع الحقيقية.

يجب أن تفرق بوضوح بين:
- المصنع المباشر (direct_manufacturer): يملك خطوط إنتاج ومعدات
- الشركة التجارية (commercial_company): وسيط يشتري من مصانع أخرى
- التاجر (trader): وسيط صغير

علامات المصنع الحقيقي:
- ذكر معدات الإنتاج والآلات
- عدد كبير من الموظفين
- شهادات ISO, CE, SGS
- عنوان في منطقة صناعية
- وجود على موقع 1688.com كـ "生产厂家"

علامات الوسيط:
- كلمات مثل "Trading", "Commerce", "Import & Export" في الاسم
- تنوع كبير في المنتجات غير المترابطة
- عنوان مكتب صغير

أرجع النتائج بصيغة JSON فقط.`
          : `You are an AI investigator specialized in finding direct Chinese manufacturers. Your task is to analyze search results and identify real factories.

You must clearly distinguish between:
- Direct Manufacturer (direct_manufacturer): Owns production lines and equipment
- Commercial Company (commercial_company): Intermediary that buys from other factories
- Trader (trader): Small intermediary

Signs of a Real Factory:
- Mentions of production equipment and machinery
- Large number of employees
- ISO, CE, SGS certifications
- Address in an industrial zone
- Presence on 1688.com as "生产厂家" (manufacturer)

Signs of an Intermediary:
- Words like "Trading", "Commerce", "Import & Export" in the name
- Wide variety of unrelated products
- Small office address

Return results in JSON format only.`;

        const userPrompt = input.language === 'ar'
          ? `بناءً على نتائج البحث التالية عن "${input.query}"، استخرج قائمة بـ 5 مصانع/موردين محتملين وقم بتقييمها:

${searchContext}

المطلوب إرجاعه بصيغة JSON:
{
  "results": [
    {
      "name": "اسم المصنع أو المورد",
      "type": "direct_manufacturer أو commercial_company أو trader أو unknown",
      "confidence": رقم من 0 إلى 100,
      "reasoning": "سبب التصنيف",
      "source": "رابط المصدر إن وجد"
    }
  ],
  "recommendations": ["توصية 1", "توصية 2"]
}`
          : `Based on the following search results for "${input.query}", extract a list of 5 potential factories/suppliers and evaluate them:

${searchContext}

Return in JSON format:
{
  "results": [
    {
      "name": "Factory or supplier name",
      "type": "direct_manufacturer or commercial_company or trader or unknown",
      "confidence": number from 0 to 100,
      "reasoning": "Reason for classification",
      "source": "Source URL if available"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

        console.log(`[AI Agent] Invoking LLM for analysis...`);
        
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'factory_search_results',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  results: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        type: {
                          type: 'string',
                          enum: ['direct_manufacturer', 'trader', 'commercial_company', 'unknown'],
                        },
                        confidence: { type: 'number' },
                        reasoning: { type: 'string' },
                        source: { type: 'string' },
                      },
                      required: ['name', 'type', 'confidence', 'reasoning'],
                    },
                  },
                  recommendations: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                required: ['results', 'recommendations'],
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (!content || typeof content !== 'string') {
          console.error(`[AI Agent] LLM returned empty or invalid content`);
          throw new Error('No response from AI');
        }
        
        const parsed = JSON.parse(content);
        console.log(`[AI Agent] Successfully parsed ${parsed.results?.length || 0} factory results`);

        return {
          query: input.query,
          language: input.language,
          results: (parsed.results || []).map((r: any) => ({
            name: r.name,
            type: r.type,
            confidence: r.confidence,
            reasoning: r.reasoning,
            isDirectFactory: r.type === 'direct_manufacturer',
            source: r.source,
          })),
          recommendations: parsed.recommendations || [],
        };
      } catch (error: any) {
        console.error('[AI Agent] Search error:', error.message || error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to search factories via AI. Please try again later.',
        });
      }
    }),

  // Verify if a specific factory is direct
  verifyFactory: publicProcedure
    .input(
      z.object({
        factoryName: z.string(),
        factoryInfo: z.string().optional(),
        language: z.enum(['ar', 'en']).default('ar'),
      })
    )
    .mutation(async ({ input }): Promise<FactoryVerificationResult> => {
      console.log(`[AI Agent] Verifying factory: "${input.factoryName}"`);
      try {
        // Real-time verification using search
        const searchQuery = `${input.factoryName} ${input.factoryInfo || ''} factory manufacturer China`;
        const searchResults = await searchDuckDuckGo(searchQuery);
        const searchContext = searchResults.map((r, i) => `[${i+1}] ${r.title}: ${r.snippet}`).join('\n');

        const systemPrompt = input.language === 'ar'
          ? `أنت خبير في التحقق من المصانع الصينية. حلل البيانات وقرر ما إذا كان المصنع حقيقياً أم وسيطاً. أرجع النتيجة بصيغة JSON.`
          : `You are an expert in verifying Chinese factories. Analyze the data and decide if the factory is real or an intermediary. Return the result in JSON format.`;

        const userPrompt = `Verify this factory: ${input.factoryName}
Context from web search:
${searchContext || 'No search context found.'}

Additional Info: ${input.factoryInfo || 'None'}

Return JSON:
{
  "type": "direct_manufacturer or trader or commercial_company or unknown",
  "confidence": number 0-100,
  "reasoning": "explanation"
}`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'factory_verification',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['direct_manufacturer', 'trader', 'commercial_company', 'unknown'],
                  },
                  confidence: { type: 'number' },
                  reasoning: { type: 'string' },
                },
                required: ['type', 'confidence', 'reasoning'],
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (!content || typeof content !== 'string') {
          throw new Error('No response from AI');
        }

        const parsed = JSON.parse(content);

        return {
          name: input.factoryName,
          type: parsed.type,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
          isDirectFactory: parsed.type === 'direct_manufacturer' && parsed.confidence >= 70,
        };
      } catch (error: any) {
        console.error('[AI Agent] Factory verification error:', error.message || error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to verify factory',
        });
      }
    }),
});
