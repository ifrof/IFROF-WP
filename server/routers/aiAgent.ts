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
  source?: string;
}

interface SearchResult {
  query: string;
  language: string;
  results: FactoryVerificationResult[];
  recommendations: string[];
}

// Helper for timeouts
const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new TRPCError({
              code: "TIMEOUT",
              message: `${label} timed out after ${ms}ms`,
            })
          ),
        ms
      )
    ),
  ]);
};

export const aiAgentRouter = router({
  // Search for factories with AI verification
  searchFactories: publicProcedure
    .input(searchQuerySchema)
    .mutation(async ({ input }): Promise<SearchResult> => {
      console.log(`[AI Agent] Starting search for: "${input.query}" in ${input.language}`);

      try {
        const searchQuery = `${input.query} ${input.category || ""} factory manufacturer China supplier`;
        const searchResults = await withTimeout(searchDuckDuckGo(searchQuery), 15000, "Web Search");

        let searchContext = "";
        if (searchResults.length > 0) {
          searchContext = searchResults
            .slice(0, 3)
            .map((r, i) => `Result ${i + 1}:\nTitle: ${r.title}\nLink: ${r.link}\nSnippet: ${r.snippet}`)
            .join("\n\n")
            .substring(0, 2000);
        } else {
          searchContext = "No search results were found.";
        }

        const systemPrompt = input.language === "ar"
            ? `أنت محقق ذكي متخصص في البحث عن المصانع الصينية المباشرة. حلل النتائج وحدد المصانع الحقيقية. أرجع JSON فقط.`
            : `You are an AI investigator specialized in finding direct Chinese manufacturers. Analyze results and identify real factories. Return JSON only.`;

        const userPrompt = input.language === "ar"
            ? `بناءً على نتائج البحث التالية عن "${input.query}":\n\n${searchContext}\n\nاستخرج قائمة بـ 5 مصانع/موردين محتملين وقم بتقييمها.`
            : `Based on the following search results for "${input.query}":\n\n${searchContext}\n\nextract a list of 5 potential factories/suppliers and evaluate them.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1500,
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
                          enum: ["direct_manufacturer", "trader", "commercial_company", "unknown"],
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
        if (!content || typeof content !== "string") throw new Error("No response from AI");

        const parsed = JSON.parse(content);
        return {
          query: input.query,
          language: input.language,
          results: (parsed.results || []).map((r: any) => ({
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
        throw new TRPCError({
          code: error?.code === "TIMEOUT" ? "TIMEOUT" : "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to search factories via AI",
        });
      }
    }),

  verifyFactory: publicProcedure
    .input(z.object({
      factoryName: z.string(),
      factoryInfo: z.string().optional(),
      language: z.enum(["ar", "en", "zh"]).default("ar"),
    }))
    .mutation(async ({ input }): Promise<FactoryVerificationResult> => {
      try {
        const searchQuery = `${input.factoryName} ${input.factoryInfo || ""} factory manufacturer China`;
        const searchResults = await withTimeout(searchDuckDuckGo(searchQuery), 10000, "Web Search");

        const searchContext = searchResults
          .slice(0, 3)
          .map((r, i) => `[${i + 1}] ${r.title}: ${r.snippet}`)
          .join("\n")
          .substring(0, 1000);

        const systemPrompt = input.language === "ar"
            ? `أنت خبير في التحقق من المصانع الصينية. حلل البيانات وقرر ما إذا كان المصنع حقيقياً أم وسيطاً. أرجع JSON.`
            : `You are an expert in verifying Chinese factories. Analyze the data and decide if the factory is real or an intermediary. Return JSON.`;

        const userPrompt = `Verify this factory: ${input.factoryName}\nContext: ${searchContext}\nInfo: ${input.factoryInfo || "None"}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 500,
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
                    enum: ["direct_manufacturer", "trader", "commercial_company", "unknown"],
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
        if (!content || typeof content !== "string") throw new Error("No response from AI");

        const parsed = JSON.parse(content);
        return {
          name: input.factoryName,
          type: parsed.type,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
          isDirectFactory: parsed.type === "direct_manufacturer" && parsed.confidence >= 70,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to verify factory",
        });
      }
    }),
});
