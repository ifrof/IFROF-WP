import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { invokeLLM } from '../_core/llm';
import { TRPCError } from '@trpc/server';

const searchQuerySchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  language: z.enum(['ar', 'en']).default('ar'),
  category: z.string().optional(),
  minCapacity: z.number().optional(),
  maxPrice: z.number().optional(),
});

interface FactoryVerificationResult {
  name: string;
  type: 'direct_manufacturer' | 'trader' | 'commercial_company' | 'unknown';
  confidence: number; // 0-100
  reasoning: string;
  isDirectFactory: boolean;
}

interface SearchResult {
  query: string;
  language: string;
  results: FactoryVerificationResult[];
  recommendations: string[];
}

export const aiAgentRouter = router({
  // Search for factories with AI verification
  searchFactories: publicProcedure
    .input(searchQuerySchema)
    .mutation(async ({ input }): Promise<SearchResult> => {
      try {
        const systemPrompt = input.language === 'ar'
          ? `أنت وكيل ذكي متخصص في البحث عن المصانع المباشرة في الصين. مهمتك هي:
1. البحث عن المصانع الحقيقية التي تطابق معايير البحث (المنتج، الموقع، الفئة).
2. التحقق من أن المصنع مباشر وليس وسيط أو شركة تجارية بناءً على البيانات المتاحة.
3. تقديم نتائج موثوقة مع درجة ثقة عالية وتفسير منطقي.

المعايير للتمييز بين المصانع المباشرة والوسطاء:
- المصنع المباشر: يملك خطوط إنتاج، لديه موظفون إنتاج، يصنع المنتجات بنفسه.
- الوسيط/التاجر: يشتري من مصانع أخرى ويعيد البيع، لا يملك خطوط إنتاج.

أرجع النتائج بصيغة JSON.`
          : `You are an AI agent specialized in finding direct manufacturers in China. Your task is to:
1. Search for real factories matching the search criteria (product, location, category).
2. Verify that the factory is a direct manufacturer, not an intermediary or trading company based on available data.
3. Provide reliable results with high confidence scores and logical reasoning.

Criteria to distinguish between direct factories and intermediaries:
- Direct Factory: owns production lines, has production staff, manufactures products themselves.
- Intermediary/Trader: buys from other factories and resells, doesn't own production lines.

Return results in JSON format.`;

        const userPrompt = input.language === 'ar'
          ? `ابحث عن مصانع حقيقية تطابق هذه المعايير:
- المنتج/البحث: ${input.query}
${input.category ? `- الفئة: ${input.category}` : ''}

تأكد من أن النتائج تحتوي على مصانع حقيقية وموثوقة. قدم 5 نتائج على الأقل مع درجة ثقة لكل واحدة.`
          : `Search for real factories matching these criteria:
- Product/Query: ${input.query}
${input.category ? `- Category: ${input.category}` : ''}

Ensure results contain real and reliable manufacturers. Provide at least 5 results with a confidence score for each.`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt as string },
            { role: 'user', content: userPrompt as string },
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
          query: input.query,
          language: input.language,
          results: parsed.results.map((r: any) => ({
            name: r.name,
            type: r.type,
            confidence: r.confidence,
            reasoning: r.reasoning,
            isDirectFactory: r.type === 'direct_manufacturer',
          })),
          recommendations: parsed.recommendations || [],
        };
      } catch (error) {
        console.error('AI Agent search error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search factories via AI. Please try again later.',
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
      try {
        const systemPrompt = input.language === 'ar'
          ? `أنت خبير في التحقق من أن المصانع مباشرة أم لا. قيّم المصنع بناءً على:
1. هل يملك خطوط إنتاج خاصة به؟
2. هل لديه موظفون إنتاج؟
3. هل يصنع المنتجات بنفسه أم يشتريها من مصانع أخرى؟

أرجع درجة ثقة من 0 إلى 100 وتفسير واضح.`
          : `You are an expert in verifying whether factories are direct manufacturers. Evaluate the factory based on:
1. Does it own its own production lines?
2. Does it have production staff?
3. Does it manufacture products itself or buy from other factories?

Return a confidence score from 0 to 100 and a clear explanation.`;

        const userPrompt = input.language === 'ar'
          ? `تحقق من هذا المصنع: ${input.factoryName}${input.factoryInfo ? `\nمعلومات إضافية: ${input.factoryInfo}` : ''}`
          : `Verify this factory: ${input.factoryName}${input.factoryInfo ? `\nAdditional information: ${input.factoryInfo}` : ''}`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt as string },
            { role: 'user', content: userPrompt as string },
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
      } catch (error) {
        console.error('Factory verification error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to verify factory',
        });
      }
    }),

  // Get AI recommendations for finding factories
  getRecommendations: publicProcedure
    .input(
      z.object({
        requirements: z.string(),
        language: z.enum(['ar', 'en']).default('ar'),
      })
    )
    .query(async ({ input }): Promise<{ recommendations: string[] }> => {
      try {
        const systemPrompt = input.language === 'ar'
          ? `أنت مستشار ذكي متخصص في مساعدة المشترين على العثور على المصانع المناسبة. قدم نصائح عملية وقابلة للتنفيذ.`
          : `You are an intelligent advisor specialized in helping buyers find suitable factories. Provide practical and actionable advice.`;

        const userPrompt = input.language === 'ar'
          ? `بناءً على هذه المتطلبات: ${input.requirements}\n\nقدم 5 نصائح للعثور على أفضل المصانع المباشرة.`
          : `Based on these requirements: ${input.requirements}\n\nProvide 5 tips for finding the best direct manufacturers.`;

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt as string },
            { role: 'user', content: userPrompt as string },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'recommendations',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                required: ['recommendations'],
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
          recommendations: parsed.recommendations || [],
        };
      } catch (error) {
        console.error('Recommendations error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get recommendations',
        });
      }
    }),
});
