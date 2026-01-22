import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { reviews, orders, factories } from "../../drizzle/schema";
import { eq, and, avg, desc } from "drizzle-orm";
import type { Review } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

const createReviewSchema = z.object({
  orderId: z.number(),
  factoryId: z.number(),
  productId: z.number().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  images: z.string().optional(), // JSON array of image URLs
});

const listReviewsSchema = z.object({
  factoryId: z.number().optional(),
  productId: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export const reviewsRouter = router({
  // Create a review (post-order only)
  create: protectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify the order exists and belongs to the buyer
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (!order || order.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      if (order[0].buyerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot review order that doesn't belong to you",
        });
      }

      // Verify order is delivered
      if (order[0].status !== "delivered") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only review delivered orders",
        });
      }

      // Check if review already exists for this order
      const existingReview = await db
        .select()
        .from(reviews)
        .where(eq(reviews.orderId, input.orderId))
        .limit(1);

      if (existingReview && existingReview.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Review already exists for this order",
        });
      }

      // Create the review
      const result = await db.insert(reviews).values({
        orderId: input.orderId,
        buyerId: ctx.user.id,
        factoryId: input.factoryId,
        productId: input.productId,
        rating: input.rating,
        comment: input.comment,
        images: input.images,
      });

      // Update factory rating
      await updateFactoryRating(db, input.factoryId);

      return result;
    }),

  // Get reviews for a factory
  getByFactory: publicProcedure
    .input(listReviewsSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      if (!input.factoryId) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      return db
        .select()
        .from(reviews)
        .where(eq(reviews.factoryId, input.factoryId))
        .orderBy(desc(reviews.createdAt))
        .limit(pageLimit)
        .offset(pageOffset);
    }),

  // Get reviews for a product
  getByProduct: publicProcedure
    .input(listReviewsSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      if (!input.productId) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      return db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, input.productId))
        .orderBy(desc(reviews.createdAt))
        .limit(pageLimit)
        .offset(pageOffset);
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

      const totalRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      const averageRating = Math.round((totalRating / allReviews.length) * 10) / 10;

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

      await db
        .update(reviews)
        .set(updateData)
        .where(eq(reviews.id, input.id));

      // Update factory rating if rating changed
      if (input.rating !== undefined) {
        await updateFactoryRating(db, review[0].factoryId);
      }

      return { success: true };
    }),

  // Delete review (owner only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
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
          message: "Cannot delete review that doesn't belong to you",
        });
      }

      // Delete the review
      await db.delete(reviews).where(eq(reviews.id, input.id));

      // Update factory rating
      await updateFactoryRating(db, review[0].factoryId);

      return { success: true };
    }),

  // Get buyer's reviews
  getByBuyer: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      return db
        .select()
        .from(reviews)
        .where(eq(reviews.buyerId, ctx.user.id))
        .orderBy(desc(reviews.createdAt))
        .limit(pageLimit)
        .offset(pageOffset);
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

      const totalRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      const averageRating = Math.round((totalRating / allReviews.length) * 10) / 10;

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
    const totalRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const averageRating = Math.round((totalRating / allReviews.length) * 10) / 10;

    await db
      .update(factories)
      .set({ rating: averageRating })
      .where(eq(factories.id, factoryId));
  }
}
