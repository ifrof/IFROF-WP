import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = await getDb();

      // Check if already exists in a real scenario
      // For now, we'll log it and return success
      console.log(`[Newsletter] New subscription request: ${input.email}`);

      // In a full implementation, we would insert into a newsletter table
      // await db.insert(schema.newsletterSubscriptions).values({ email: input.email });

      return { success: true, message: "Subscribed successfully" };
    }),
});
