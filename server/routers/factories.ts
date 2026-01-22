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
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  nameZh: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  specifications: z.string().optional(),
  minPrice: z.number().min(0),
  maxPrice: z.number().optional(),
  currency: z.string().default("USD"),
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
    .input(z.object({ 
      query: z.string().optional(),
      location: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      return db.searchFactoriesAdvanced(input);
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

  // Admin: Approve factory verification
  approveVerification: protectedProcedure
    .input(z.object({ id: z.number(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can approve factories" });
      }

      await db.updateFactory(input.id, {
        verificationStatus: "verified",
        verificationNotes: input.notes,
        verifiedAt: new Date(),
      });

      return { success: true };
    }),

  // Admin: Reject factory verification
  rejectVerification: protectedProcedure
    .input(z.object({ id: z.number(), reason: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can reject factories" });
      }

      await db.updateFactory(input.id, {
        verificationStatus: "rejected",
        verificationNotes: input.reason,
      });

      return { success: true };
    }),

  // Admin: Get pending verifications
  getPendingVerifications: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view pending verifications" });
      }

      return db.getFactoriesByStatus("pending");
    }),
});

import { getCached } from "../utils/cache";

export const productsRouter = router({
  // Get all products (public)
  getAll: publicProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      const cacheKey = `products:all:${limit}:${offset}`;
      
      return getCached(
        cacheKey,
        () => db.getAllProducts(limit, offset),
        300 // 5 minutes
      );
    }),

  // Get products by factory (public)
  getByFactory: publicProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ input }) => {
      return db.getProductsByFactory(input.factoryId);
    }),

  // Get related products (public)
  getRelated: publicProcedure
    .input(z.object({ factoryId: z.number(), excludeProductId: z.number(), limit: z.number().default(4) }))
    .query(async ({ input }) => {
      return db.getRelatedProducts(input.factoryId, input.excludeProductId, input.limit);
    }),

  // Get single product (public)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await db.getProductById(input.id);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      
      // Fetch factory info to satisfy client-side expectations
      const productData = product as any;
      const factory = await db.getFactoryById(productData.factoryId);
      
      return {
        ...productData,
        factory, // Add factory relation
        product: productData, // Alias for compatibility if needed
      };
    }),

  // Search products (public)
  search: publicProcedure
    .input(z.object({ 
      query: z.string().optional(),
      category: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      moq: z.number().optional(),
      location: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      return db.searchProductsAdvanced(input);
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
        minPrice: Math.round(data.minPrice * 100), // Convert to cents
        maxPrice: data.maxPrice ? Math.round(data.maxPrice * 100) : null,
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
        minPrice: Math.round(data.minPrice * 100), // Convert to cents
        maxPrice: data.maxPrice ? Math.round(data.maxPrice * 100) : null,
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

  // Get featured products
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return db.getFeaturedProducts(input.limit);
    }),

  // Get categories
  getCategories: publicProcedure.query(async () => {
    return db.getProductCategories();
  }),
});
