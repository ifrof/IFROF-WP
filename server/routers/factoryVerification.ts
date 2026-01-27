import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";
import { searchDuckDuckGo } from "../utils/search";

const verificationInputSchema = z.object({
  factory_name: z.string().min(2),
  location: z.string().optional(),
  website: z.string().optional(),
  language: z.enum(["ar", "en", "zh"]).default("en"),
});

export const factoryVerificationRouter = router({
  verify: publicProcedure
    .input(verificationInputSchema)
    .mutation(async ({ input }) => {
      const { factory_name, location, website, language } = input;

      try {
        // 1. Perform multiple searches
        const searchQueries = [
          `${factory_name} ${location || ""} official website business license`,
          `${factory_name} ${location || ""} site:alibaba.com OR site:1688.com supplier profile`,
          `${factory_name} ${location || ""} factory tour video reviews trading company`,
        ];

        const searchPromises = searchQueries.map(q => searchDuckDuckGo(q));
        const searchResultsArray = await Promise.all(searchPromises);
        const allSearchResults = searchResultsArray.flat();

        // 2. Prepare context for LLM
        const searchContext = allSearchResults
          .map(
            (r, i) =>
              `Result ${i + 1}:
Title: ${r.title}
Link: ${r.link}
Snippet: ${r.snippet}`
          )
          .join("\n\n");

        // 3. Invoke LLM for analysis
        const systemPrompt = `You are an expert industrial auditor specializing in verifying Chinese manufacturers. 
Your goal is to distinguish between real direct factories and trading companies/intermediaries.

Analyze the provided search results for "${factory_name}" ${location ? `located in ${location}` : ""}.
${website ? `Official website: ${website}` : ""}

Criteria for a Real Factory:
- Specific manufacturing equipment mentioned.
- Large number of employees (especially production staff).
- Ownership of land or large facility.
- ISO, CE, or other manufacturing certifications.
- Presence on 1688.com as a "Manufacturer" (生产厂家).
- Clear factory address and production capacity.

Red Flags for Trading Companies:
- "Trading", "Commerce", "Import & Export" in the name.
- Wide variety of unrelated products.
- Small office address instead of an industrial zone.
- No mention of production lines or machinery.

Provide your report in ${language === "ar" ? "Arabic" : language === "zh" ? "Chinese" : "English"}.`;

        const userPrompt = `Based on these search results, provide a verification report for "${factory_name}":

${searchContext}

Output the result in the following JSON format:
{
  "score": number (1-10),
  "is_verified": boolean,
  "evidence": [
    { "finding": "string", "source": "url" }
  ],
  "recommendation": "string"
}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "verification_report",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  score: { type: "number", minimum: 1, maximum: 10 },
                  is_verified: { type: "boolean" },
                  evidence: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        finding: { type: "string" },
                        source: { type: "string" },
                      },
                      required: ["finding", "source"],
                      additionalProperties: false,
                    },
                  },
                  recommendation: { type: "string" },
                },
                required: [
                  "score",
                  "is_verified",
                  "evidence",
                  "recommendation",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (!content || typeof content !== "string") {
          throw new Error("No response from AI");
        }

        return JSON.parse(content);
      } catch (error) {
        console.error("Factory verification error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify factory. Please try again later.",
        });
      }
    }),
});
