import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

const factorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  certifications: z.string().optional(),
  productCategories: z.string().optional(),
  productionCapacity: z.string().optional(),
  minimumOrderQuantity: z.number().optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  specifications: z.string().optional(),
  basePrice: z.number().min(0),
  pricingTiers: z.string().optional(),
  minimumOrderQuantity: z.number().default(1),
  imageUrls: z.string().optional(),
});

export const factoriesRouter = router({
  // Get all factories (public)
  list: publicProcedure.query(async () => {
    return db.getAllFactories();
  }),

  // Get single factory by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const factory = await db.getFactoryById(input.id);
      if (!factory) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Factory not found" });
      }
      return factory;
    }),

  // Search factories (public)
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return db.searchFactories(input.query);
    }),

  // Create factory (admin only)
  create: protectedProcedure
    .input(factorySchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create factories" });
      }

      const result = await db.createFactory({
        ...input,
        verificationStatus: "verified", // Admin-created factories are auto-verified
      });

      return result;
    }),

  // Update factory (admin only)
  update: protectedProcedure
    .input(z.object({ id: z.number(), ...factorySchema.shape }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update factories" });
      }

      const { id, ...data } = input;
      await db.updateFactory(id, data);
      return db.getFactoryById(id);
    }),

  // Delete factory (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete factories" });
      }

      // Note: In production, you'd want to soft-delete or handle related records
      throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Delete not yet implemented" });
    }),
});

export const productsRouter = router({
  // Get products by factory (public)
  getByFactory: publicProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ input }) => {
      return db.getProductsByFactory(input.factoryId);
    }),

  // Get single product (public)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await db.getProductById(input.id);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      return product;
    }),

  // Search products (public)
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return db.searchProducts(input.query);
    }),

  // Create product (admin only)
  create: protectedProcedure
    .input(z.object({ factoryId: z.number(), ...productSchema.shape }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create products" });
      }

      const { factoryId, ...data } = input;
      const result = await db.createProduct({
        factoryId,
        ...data,
        basePrice: Math.round(data.basePrice * 100), // Convert to cents
      });

      return result;
    }),

  // Update product (admin only)
  update: protectedProcedure
    .input(z.object({ id: z.number(), factoryId: z.number(), ...productSchema.shape }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update products" });
      }

      const { id, ...data } = input;
      await db.updateProduct(id, {
        ...data,
        basePrice: Math.round(data.basePrice * 100), // Convert to cents
      });
      return db.getProductById(id);
    }),

  // Delete product (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete products" });
      }

      throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Delete not yet implemented" });
    }),
});
