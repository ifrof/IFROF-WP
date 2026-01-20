import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const reviewsRouter = router({
  // Get reviews for a product
  getByProduct: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      // TODO: Implement reviews functionality
      return [];
    }),

  // Create review
  create: protectedProcedure
    .input(z.object({ productId: z.number(), rating: z.number(), comment: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement reviews functionality
      return { success: true };
    }),

  // Get average rating for a product
  getAverageRating: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      // TODO: Implement reviews functionality
      return { rating: 0, count: 0 };
    }),
});
