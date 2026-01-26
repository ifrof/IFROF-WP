import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { factories } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";

const verifyFactorySchema = z.object({
  companyName: z.string(),
  businessLicense: z.string(),
  factoryPhotos: z.array(z.string()).optional(),
  productionCapacity: z.string().optional(),
  yearsInBusiness: z.number().optional(),
  certifications: z.array(z.string()).optional(),
  description: z.string(),
});

export const factoryVerificationAiRouter = router({
  verifyFactory: protectedProcedure
    .input(verifyFactorySchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const prompt = `You are an expert factory verification system. Analyze the following company information and determine if this is a REAL MANUFACTURING FACTORY or a TRADER/MIDDLEMAN company.

Company Information:
- Name: ${input.companyName}
- Business License: ${input.businessLicense}
- Description: ${input.description}
- Years in Business: ${input.yearsInBusiness || "Not provided"}
- Production Capacity: ${input.productionCapacity || "Not provided"}
- Certifications: ${input.certifications?.join(", ") || "None provided"}

Red flags for traders/middlemen:
1. Generic descriptions (e.g., "we supply products")
2. No specific production details
3. Very new companies (less than 2 years)
4. No certifications or quality standards
5. Claims to supply everything (jack of all trades)
6. No mention of manufacturing equipment or facilities
7. Generic business license without manufacturing classification

Green flags for real factories:
1. Specific production processes mentioned
2. Equipment specifications provided
3. Quality certifications (ISO, CE, etc.)
4. Years of manufacturing experience
5. Specific production capacity numbers
6. Factory photos or facility details
7. Manufacturing-specific business classification

Respond with JSON:
{
  "isRealFactory": boolean,
  "confidence": number (0-100),
  "reasoning": "detailed explanation",
  "riskFactors": ["factor1", "factor2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

      try {
        const aiResponse = await invokeLLM(prompt);
        const verification = JSON.parse(aiResponse);

        return {
          isRealFactory: verification.isRealFactory,
          confidence: verification.confidence,
          reasoning: verification.reasoning,
          riskFactors: verification.riskFactors,
          recommendations: verification.recommendations,
          verified: verification.isRealFactory && verification.confidence > 70,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI verification failed",
        });
      }
    }),

  getVerificationStatus: publicProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const factory = await db
        .select()
        .from(factories)
        .where(eq(factories.id, input.factoryId))
        .limit(1);

      if (!factory || factory.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Factory not found",
        });
      }

      return {
        factoryId: factory[0].id,
        companyName: factory[0].companyName,
        verified: factory[0].verified || false,
        verificationScore: factory[0].verificationScore || 0,
        verifiedAt: factory[0].verifiedAt,
      };
    }),

  listVerifiedFactories: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      return db
        .select()
        .from(factories)
        .where(eq(factories.verified, 1))
        .limit(pageLimit)
        .offset(pageOffset);
    }),
});
