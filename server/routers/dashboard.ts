import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const dashboardRouter = router({
  // Get dashboard stats
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      // TODO: Implement dashboard functionality
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        pendingOrders: 0,
      };
    }),

  // Get recent orders
  getRecentOrders: protectedProcedure
    .query(async ({ ctx }) => {
      // TODO: Implement dashboard functionality
      return [];
    }),

  // Get analytics data
  getAnalytics: protectedProcedure
    .input(z.object({ period: z.enum(["week", "month", "year"]).optional() }))
    .query(async ({ ctx, input }) => {
      // TODO: Implement dashboard functionality
      return [];
    }),

  // Added methods for Buyer Dashboard
  getMyOrders: protectedProcedure
    .query(async ({ ctx }) => {
      return db.getOrdersByBuyer(ctx.user.id);
    }),

  getMyInquiries: protectedProcedure
    .query(async ({ ctx }) => {
      return db.getInquiriesByBuyer(ctx.user.id);
    }),

  // Added methods for Factory Dashboard
  getOrdersByFactory: protectedProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      // In a real app, verify user owns factory
      const { orders } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db_instance = await db.getDb();
      if (!db_instance) return [];
      return db_instance.select().from(orders).where(eq(orders.factoryId, input.factoryId));
    }),

  getServicesByFactory: protectedProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { services } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db_instance = await db.getDb();
      if (!db_instance) return [];
      return db_instance.select().from(services).where(eq(services.factoryId, input.factoryId));
    }),

  // Added methods for Admin Dashboard
  getSystemStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db_instance = await db.getDb();
      if (!db_instance) return { users: 0, factories: 0, products: 0, orders: 0 };
      
      const { users, factories, products, orders } = await import('../../drizzle/schema');
      
      // Simplified count for demonstration
      const usersList = await db_instance.select().from(users);
      const factoriesList = await db_instance.select().from(factories);
      const productsList = await db_instance.select().from(products);
      const ordersList = await db_instance.select().from(orders);

      return {
        users: usersList.length,
        factories: factoriesList.length,
        products: productsList.length,
        orders: ordersList.length,
      };
    }),

  getAllUsers: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { users } = await import('../../drizzle/schema');
      const db_instance = await db.getDb();
      if (!db_instance) return [];
      return db_instance.select().from(users);
    }),
});
