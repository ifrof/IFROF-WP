import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import * as schema from "../../drizzle/schema";
import { eq, desc, sql, and, like } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminRouter = router({
  // Dashboard Stats
  getStats: adminProcedure.query(async ({ ctx }) => {
    const db = ctx.db;
    
    // Total Products
    const productsCount = await db.select({ count: sql<number>`count(*)` }).from(schema.products);
    
    // Total Orders
    const ordersCount = await db.select({ count: sql<number>`count(*)` }).from(schema.orders);
    
    // Total Users
    const usersCount = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
    
    // Total Revenue
    const revenue = await db.select({ 
      total: sql<number>`sum(${schema.orders.totalAmount})` 
    }).from(schema.orders).where(eq(schema.orders.paymentStatus, 'completed'));

    // Recent Orders
    const recentOrders = await db.select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(10);

    // Recent Inquiries
    const recentInquiries = await db.select()
      .from(schema.inquiries)
      .orderBy(desc(schema.inquiries.createdAt))
      .limit(10);

    return {
      stats: {
        products: productsCount[0]?.count || 0,
        orders: ordersCount[0]?.count || 0,
        users: usersCount[0]?.count || 0,
        revenue: (revenue[0]?.total || 0) / 100, // Convert cents to dollars
      },
      recentOrders,
      recentInquiries
    };
  }),

  // Product Management
  getProducts: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().default(0),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db;
      let query = db.select().from(schema.products);
      
      if (input.search) {
        query = query.where(like(schema.products.name, `%${input.search}%`));
      }
      
      const products = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(schema.products.createdAt));
        
      return products;
    }),

  createProduct: adminProcedure
    .input(z.object({
      factoryId: z.number(),
      name: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
      basePrice: z.number(),
      minimumOrderQuantity: z.number().default(1),
      imageUrls: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const result = await db.insert(schema.products).values({
        ...input,
        active: 1,
      });
      return { success: true, id: result[0]?.insertId };
    }),

  updateProduct: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      basePrice: z.number().optional(),
      minimumOrderQuantity: z.number().optional(),
      imageUrls: z.string().optional(),
      active: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const { id, ...data } = input;
      await db.update(schema.products)
        .set(data)
        .where(eq(schema.products.id, id));
      return { success: true };
    }),

  deleteProduct: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      // Soft delete by setting active to 0
      await db.update(schema.products)
        .set({ active: 0 })
        .where(eq(schema.products.id, input.id));
      return { success: true };
    }),

  // Order Management
  getOrders: adminProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db;
      let query = db.select().from(schema.orders);
      
      if (input.status) {
        query = query.where(eq(schema.orders.status, input.status as any));
      }
      
      const orders = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(schema.orders.createdAt));
        
      return orders;
    }),

  updateOrderStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      await db.update(schema.orders)
        .set({ status: input.status })
        .where(eq(schema.orders.id, input.id));
      return { success: true };
    }),

  // User Management
  getUsers: adminProcedure
    .input(z.object({
      limit: z.number().default(50),
      offset: z.number().default(0),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db;
      let query = db.select().from(schema.users);
      
      if (input.search) {
        query = query.where(or(
          like(schema.users.email, `%${input.search}%`),
          like(schema.users.name, `%${input.search}%`)
        ));
      }
      
      const users = await query
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(schema.users.createdAt));
        
      return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
    }),

  updateUserRole: adminProcedure
    .input(z.object({
      id: z.number(),
      role: z.enum(["user", "admin", "factory", "buyer"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      await db.update(schema.users)
        .set({ role: input.role })
        .where(eq(schema.users.id, input.id));
      return { success: true };
    }),

  // Factory Management
  getFactories: adminProcedure
    .input(z.object({
      status: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db;
      let query = db.select().from(schema.factories);
      
      if (input.status) {
        query = query.where(eq(schema.factories.verificationStatus, input.status as any));
      }
      
      return await query.orderBy(desc(schema.factories.createdAt));
    }),

  updateFactoryStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "verified", "rejected"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      await db.update(schema.factories)
        .set({ verificationStatus: input.status })
        .where(eq(schema.factories.id, input.id));
      return { success: true };
    }),
});
