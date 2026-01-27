import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { factories, products } from "../db/schema";
import { sql, like, and, gte, lte } from "drizzle-orm";

export const searchRouter = router({
  factories: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        country: z.string().optional(),
        minScore: z.number().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const conditions = [];

        if (input.query) {
          conditions.push(
            sql`MATCH(${factories.name}, ${factories.description}) AGAINST(${input.query} IN BOOLEAN MODE)`
          );
        }

        if (input.country) {
          conditions.push(like(factories.country, `%${input.country}%`));
        }

        if (input.minScore) {
          conditions.push(gte(factories.verified_score, input.minScore));
        }

        const results = await db
          .select()
          .from(factories)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .limit(input.limit);

        return results;
      } catch (error) {
        console.error("Search factories error:", error);
        return [];
      }
    }),

  products: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        category: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const conditions = [];

        if (input.query) {
          conditions.push(
            sql`MATCH(${products.name}, ${products.description}) AGAINST(${input.query} IN BOOLEAN MODE)`
          );
        }

        if (input.category) {
          conditions.push(like(products.category, `%${input.category}%`));
        }

        if (input.minPrice) {
          conditions.push(gte(products.price_per_unit, input.minPrice));
        }

        if (input.maxPrice) {
          conditions.push(lte(products.price_per_unit, input.maxPrice));
        }

        const results = await db
          .select()
          .from(products)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .limit(input.limit);

        return results;
      } catch (error) {
        console.error("Search products error:", error);
        return [];
      }
    }),

  trending: publicProcedure.query(async () => {
    try {
      const results = await db
        .select()
        .from(products)
        .limit(10);

      return results;
    } catch (error) {
      console.error("Trending error:", error);
      return [];
    }
  }),

  suggestions: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        const results = await db
          .select({ name: factories.name })
          .from(factories)
          .where(like(factories.name, `%${input.query}%`))
          .limit(5);

        return results.map((r) => r.name);
      } catch (error) {
        console.error("Suggestions error:", error);
        return [];
      }
    }),
});
