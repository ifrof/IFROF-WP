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

  // Get factory rating statistics
  getFactoryStats: publicProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const allReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.factoryId, input.factoryId));

      if (!allReviews || allReviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
        };
      }

      const totalRating = allReviews.reduce(
        (sum: number, r: any) => sum + r.rating,
        0
      );
      const averageRating =
        Math.round((totalRating / allReviews.length) * 10) / 10;

      return {
        averageRating,
        totalReviews: allReviews.length,
      };
    }),

  // Update review (owner only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        rating: z.number().min(1).max(5).optional(),
        comment: z.string().optional(),
        images: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify review exists and belongs to the user
      const review = await db
        .select()
        .from(reviews)
        .where(eq(reviews.id, input.id))
        .limit(1);

      if (!review || review.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (review[0].buyerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot update review that doesn't belong to you",
        });
      }

      // Update the review
      const updateData: any = {};
      if (input.rating !== undefined) updateData.rating = input.rating;
      if (input.comment !== undefined) updateData.comment = input.comment;
      if (input.images !== undefined) updateData.images = input.images;
      updateData.updatedAt = new Date();

      await db.update(reviews).set(updateData).where(eq(reviews.id, input.id));

      // Update factory rating if rating changed
      if (input.rating !== undefined) {
        await updateFactoryRating(db, review[0].factoryId);
      }

      return { success: true };
    }),

  // Get average rating for a product
  getAverageRating: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { rating: 0, count: 0 };

      const allReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, input.productId));

      if (!allReviews || allReviews.length === 0) {
        return { rating: 0, count: 0 };
      }

      const totalRating = allReviews.reduce(
        (sum: number, r: any) => sum + r.rating,
        0
      );
      const averageRating =
        Math.round((totalRating / allReviews.length) * 10) / 10;

      return {
        rating: averageRating,
        count: allReviews.length,
      };
    }),
});

// Helper function to update factory rating
async function updateFactoryRating(db: any, factoryId: number) {
  const allReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.factoryId, factoryId));

  if (allReviews && allReviews.length > 0) {
    const totalRating = allReviews.reduce(
      (sum: number, r: any) => sum + r.rating,
      0
    );
    const averageRating =
      Math.round((totalRating / allReviews.length) * 10) / 10;

    await db
      .update(factories)
      .set({ rating: averageRating })
      .where(eq(factories.id, factoryId));
  }
}
