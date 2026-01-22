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
        // 1. Perform real-time search using DuckDuckGo
        const searchQuery = `${input.query} ${input.category || ''} factory manufacturer China business license`;
        const searchResults = await searchDuckDuckGo(searchQuery);
        
        console.log(`[AI Agent] Search returned ${searchResults.length} results`);

        if (searchResults.length === 0) {
          console.warn(`[AI Agent] No search results found for query: ${searchQuery}`);
          // We still continue to let LLM handle the "no results" case or provide general advice
        }

        const searchContext = searchResults.map((r, i) => 
          `Result ${i+1}:
Title: ${r.title}
Link: ${r.link}
Snippet: ${r.snippet}`
        ).join('\n\n');

        // 2. Use LLM to analyze search results and identify real factories
        const systemPrompt = input.language === 'ar'
          ? `أنت وكيل ذكي متخصص في البحث عن المصانع المباشرة في الصين. مهمتك هي تحليل نتائج البحث وتحديد المصانع الحقيقية.
يجب أن تفرق بوضوح بين المصنع المباشر (الذي يملك خطوط إنتاج) والشركة التجارية (الوسيط).
أرجع النتائج بصيغة JSON فقط.`
          : `You are an AI agent specialized in finding direct manufacturers in China. Your task is to analyze search results and identify real factories.
You must clearly distinguish between a direct manufacturer (owns production lines) and a trading company (intermediary).
Return results in JSON format only.`;

        const userPrompt = input.language === 'ar'
          ? `بناءً على نتائج البحث التالية، استخرج قائمة بـ 5 مصانع محتملة وقم بتقييمها:
${searchContext || 'لا توجد نتائج بحث متاحة حالياً.'}

المطلوب:
1. اسم المصنع.
2. النوع (direct_manufacturer أو trader).
3. درجة الثقة (0-100).
4. التفسير (لماذا تعتقد أنه مصنع أو وسيط).
5. توصيات عامة للمشتري.`
          : `Based on the following search results, extract a list of 5 potential factories and evaluate them:
${searchContext || 'No search results available currently.'}

Required:
1. Factory Name.
2. Type (direct_manufacturer or trader).
3. Confidence Score (0-100).
4. Reasoning (Why you think it's a factory or intermediary).
5. General recommendations for the buyer.`;

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
                        confidence: { type: 'number', minimum: 0, maximum: 100 },
                        reasoning: { type: 'string' },
                        source: { type: 'string' },
                      },
                      required: ['name', 'type', 'confidence', 'reasoning'],
                      additionalProperties: false,
                    },
                  },
                  recommendations: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                required: ['results', 'recommendations'],
                additionalProperties: false,
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
        console.error('[AI Agent] Search error:', error);
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
        const searchQuery = `${input.factoryName} ${input.factoryInfo || ''} factory manufacturer China verification`;
        const searchResults = await searchDuckDuckGo(searchQuery);
        const searchContext = searchResults.map((r, i) => `[${i+1}] ${r.title}: ${r.snippet}`).join('\n');

        const systemPrompt = input.language === 'ar'
          ? `أنت خبير في التحقق من المصانع الصينية. حلل البيانات وقرر ما إذا كان المصنع حقيقياً أم وسيطاً.`
          : `You are an expert in verifying Chinese factories. Analyze the data and decide if the factory is real or an intermediary.`;

        const userPrompt = `Verify this factory: ${input.factoryName}
Context from web search:
${searchContext || 'No search context found.'}

Additional Info: ${input.factoryInfo || 'None'}`;

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
                  confidence: { type: 'number', minimum: 0, maximum: 100 },
                  reasoning: { type: 'string' },
                },
                required: ['type', 'confidence', 'reasoning'],
                additionalProperties: false,
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
        console.error('[AI Agent] Factory verification error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to verify factory',
        });
      }
    }),
});
