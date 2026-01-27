import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";
import { searchDuckDuckGo } from "../utils/search";

const searchQuerySchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters"),
  language: z.enum(["ar", "en", "zh"]).default("ar"),
  category: z.string().optional(),
  minCapacity: z.number().optional(),
  maxPrice: z.number().optional(),
});

interface FactoryVerificationResult {
  name: string;
  type: "direct_manufacturer" | "trader" | "commercial_company" | "unknown";
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
    .mutation(async ({ input, ctx }): Promise<SearchResult> => {
      console.log(
        `[AI Agent] Starting search for: "${input.query}" in ${input.language}`
      );

      try {
        // 1. Perform real-time search using DuckDuckGo (with 10s timeout)
        const searchQuery = `${input.query} ${input.category || ""} factory manufacturer China supplier`;
        const searchResults = await searchDuckDuckGo(searchQuery);

        console.log(
          `[AI Agent] DuckDuckGo returned ${searchResults.length} results`
        );

        // Build search context for LLM - Optimization: Limit to top 3 results and truncate
        let searchContext = "";
        if (searchResults.length > 0) {
          searchContext = searchResults
            .slice(0, 3)
            .map(
              (r, i) =>
                `Result ${i + 1}:
Title: ${r.title}
Link: ${r.link}
Snippet: ${r.snippet}`
            )
            .join("\n\n")
            .substring(0, 2500); // Hard cap context to 2500 chars
        } else {
          searchContext =
            "No search results were found. Please provide general guidance based on the query.";
        }

        // 2. Use LLM to analyze search results and identify real factories
        const systemPrompt =
          input.language === "ar"
            ? `أنت محقق ذكي متخصص في البحث عن المصانع الصينية المباشرة. حلل النتائج وحدد المصانع الحقيقية. أرجع JSON فقط.`
            : `You are an AI investigator specialized in finding direct Chinese manufacturers. Analyze results and identify real factories. Return JSON only.`;

        const userPrompt =
          input.language === "ar"
            ? `بناءً على نتائج البحث التالية عن "${input.query}"، استخرج قائمة بـ 5 مصانع/موردين محتملين وقم بتقييمها:

تأكد من أن النتائج تحتوي على مصانع مباشرة فقط. قدم 5 نتائج على الأقل مع درجة ثقة لكل واحدة.`
          : `Search for factories matching these criteria:
- Query: ${input.query}
${input.category ? `- Category: ${input.category}` : ''}
${input.minCapacity ? `- Minimum Production Capacity: ${input.minCapacity}` : ''}
${input.maxPrice ? `- Maximum Price: ${input.maxPrice}` : ''}

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "factory_search_results",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: {
                          type: "string",
                          enum: [
                            "direct_manufacturer",
                            "trader",
                            "commercial_company",
                            "unknown",
                          ],
                        },
                        confidence: { type: "number" },
                        reasoning: { type: "string" },
                        source: { type: "string" },
                      },
                      required: ["name", "type", "confidence", "reasoning"],
                    },
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["results", "recommendations"],
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (!content || typeof content !== "string") {
          console.error(`[AI Agent] LLM returned empty or invalid content`);
          throw new Error("No response from AI");
        }

        const parsed = JSON.parse(content);
        console.log(
          `[AI Agent] Successfully parsed ${parsed.results?.length || 0} factory results`
        );

        return {
          query: input.query,
          language: input.language,
          results: directFactories.map((r: any) => ({
            name: r.name,
            type: r.type,
            confidence: r.confidence,
            reasoning: r.reasoning,
            isDirectFactory: r.type === "direct_manufacturer",
            source: r.source,
          })),
          recommendations: parsed.recommendations || [],
        };
      } catch (error: any) {
        console.error("[AI Agent] Search error:", error.message || error);
        throw new TRPCError({
          code: error.code || "INTERNAL_SERVER_ERROR",
          message:
            error.message ||
            "Failed to search factories via AI. Please try again later.",
        });
      }
    }),

  // Verify if a specific factory is direct
  verifyFactory: publicProcedure
    .input(
      z.object({
        factoryName: z.string(),
        factoryInfo: z.string().optional(),
        language: z.enum(["ar", "en", "zh"]).default("ar"),
      })
    )
    .mutation(async ({ input }): Promise<FactoryVerificationResult> => {
      try {
        // Real-time verification using search (with 10s timeout)
        const searchQuery = `${input.factoryName} ${input.factoryInfo || ""} factory manufacturer China`;
        const searchResults = await searchDuckDuckGo(searchQuery);
        const searchContext = searchResults
          .slice(0, 2)
          .map((r, i) => `[${i + 1}] ${r.title}: ${r.snippet}`)
          .join("\n")
          .substring(0, 1000);

        const systemPrompt =
          input.language === "ar"
            ? `أنت خبير في التحقق من المصانع الصينية. حلل البيانات وقرر ما إذا كان المصنع حقيقياً أم وسيطاً. أرجع JSON.`
            : `You are an expert in verifying Chinese factories. Analyze the data and decide if the factory is real or an intermediary. Return JSON.`;

        const userPrompt = `Verify this factory: ${input.factoryName}
Context from web search:
${searchContext || "No search context found."}

Additional Info: ${input.factoryInfo || "None"}

        const userPrompt = input.language === 'ar'
          ? `تحقق من هذا المصنع: ${input.factoryName}${input.factoryInfo ? `\nمعلومات إضافية: ${input.factoryInfo}` : ''}`
          : `Verify this factory: ${input.factoryName}${input.factoryInfo ? `\nAdditional information: ${input.factoryInfo}` : ''}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "factory_verification",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "direct_manufacturer",
                      "trader",
                      "commercial_company",
                      "unknown",
                    ],
                  },
                  confidence: { type: "number" },
                  reasoning: { type: "string" },
                },
                required: ["type", "confidence", "reasoning"],
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (!content || typeof content !== "string") {
          throw new Error("No response from AI");
        }

        const parsed = JSON.parse(content);

        return {
          name: input.factoryName,
          type: parsed.type,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
          isDirectFactory:
            parsed.type === "direct_manufacturer" && parsed.confidence >= 70,
        };
      } catch (error: any) {
        console.error(
          "[AI Agent] Factory verification error:",
          error.message || error
        );
        throw new TRPCError({
          code: error.code || "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to verify factory",
        });
      }
    }),
});
