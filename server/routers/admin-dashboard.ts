import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, factories, orders, products } from "../../drizzle/schema";
import { eq, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

async function requireAdmin(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user || user.length === 0 || user[0].role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return true;
}

export const adminDashboardRouter = router({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    await requireAdmin(ctx.user.id);

    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    const totalUsers = await db.select({ count: count() }).from(users);
    const totalFactories = await db.select({ count: count() }).from(factories);
    const totalOrders = await db.select({ count: count() }).from(orders);
    const totalProducts = await db.select({ count: count() }).from(products);

    const verifiedFactories = await db
      .select({ count: count() })
      .from(factories)
      .where(eq(factories.verificationStatus, "verified"));

    const completedOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    return {
      totalUsers: totalUsers[0]?.count || 0,
      totalFactories: totalFactories[0]?.count || 0,
      verifiedFactories: verifiedFactories[0]?.count || 0,
      totalOrders: totalOrders[0]?.count || 0,
      completedOrders: completedOrders[0]?.count || 0,
      totalProducts: totalProducts[0]?.count || 0,
      revenue: (completedOrders[0]?.count || 0) * 99,
    };
  }),

  listAllFactories: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        verified: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      await requireAdmin(ctx.user.id);

      const db = await getDb();
      if (!db) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      let query = db.select().from(factories);

      if (input.verified !== undefined) {
        query = query.where(eq(factories.verificationStatus, input.verified ? "verified" : "pending"));
      }

      return query.limit(pageLimit).offset(pageOffset);
    }),

  approveFactory: protectedProcedure
    .input(z.object({ factoryId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await requireAdmin(ctx.user.id);

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db
        .update(factories)
        .set({ verificationStatus: "verified", verifiedAt: new Date() })
        .where(eq(factories.id, input.factoryId));

      return { success: true };
    }),

  rejectFactory: protectedProcedure
    .input(z.object({ factoryId: z.number(), reason: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requireAdmin(ctx.user.id);

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db
        .update(factories)
        .set({ verificationStatus: "rejected", verificationNotes: input.reason })
        .where(eq(factories.id, input.factoryId));

      return { success: true };
    }),

  listAllOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      await requireAdmin(ctx.user.id);

      const db = await getDb();
      if (!db) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      return db
        .select()
        .from(orders)
        .limit(pageLimit)
        .offset(pageOffset);
    }),

  getOrderDetails: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireAdmin(ctx.user.id);

      const db = await getDb();
      if (!db) return null;

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      return order.length > 0 ? order[0] : null;
    }),
});
