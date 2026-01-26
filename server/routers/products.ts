import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { products, factories } from "../../drizzle/schema";
import { eq, like, and, desc, gte, lte, or } from "drizzle-orm";
import type { Product } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

const searchProductsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  moq: z.number().optional(),
  location: z.string().optional(),
  factoryId: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
  lang: z.enum(["ar", "en", "zh"]).default("ar"),
});

export const productsRouter = router({
  // Get all products with pagination
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      return db
        .select()
        .from(products)
        .where(eq(products.active, 1))
        .orderBy(desc(products.createdAt))
        .limit(pageLimit)
        .offset(pageOffset);
    }),

  // Search products with advanced filtering
  search: publicProcedure
    .input(searchProductsSchema)
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      const conditions = [eq(products.active, 1)];

      // Search by name in multiple languages
      if (input.query) {
        const searchTerm = `%${input.query}%`;
        const searchCondition = or(
          like(products.nameAr, searchTerm),
          like(products.nameEn, searchTerm),
          like(products.nameZh, searchTerm),
          like(products.descriptionAr, searchTerm),
          like(products.descriptionEn, searchTerm),
          like(products.descriptionZh, searchTerm)
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      // Filter by category
      if (input.category) {
        conditions.push(eq(products.category, input.category));
      }

      // Filter by price range
      if (input.minPrice !== undefined) {
        conditions.push(gte(products.minPrice, input.minPrice));
      }
      if (input.maxPrice !== undefined) {
        conditions.push(lte(products.maxPrice, input.maxPrice));
      }

      // Filter by MOQ
      if (input.moq !== undefined) {
        conditions.push(lte(products.minimumOrderQuantity, input.moq));
      }

      // Filter by factory
      if (input.factoryId !== undefined) {
        conditions.push(eq(products.factoryId, input.factoryId));
      }

      // Filter by location (through factory) - optimized with JOIN
      if (input.location) {
        // Fetch products with factory location filter
        const allProducts = await db
          .select()
          .from(products)
          .where(and(...conditions));

        // Get all factories with matching location
        const matchingFactories = await db
          .select()
          .from(factories)
          .where(like(factories.location, `%${input.location}%`));

        const factoryIds = matchingFactories.map((f: any) => f.id);
        const filtered = allProducts.filter((p: any) => factoryIds.includes(p.factoryId));

        return filtered.slice(pageOffset, pageOffset + pageLimit);
      }

      return db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(pageLimit)
        .offset(pageOffset);
    }),

  // Get products by factory
  getByFactory: publicProcedure
    .input(
      z.object({
        factoryId: z.number(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;

      return db
        .select()
        .from(products)
        .where(and(eq(products.factoryId, input.factoryId), eq(products.active, 1)))
        .orderBy(desc(products.createdAt))
        .limit(pageLimit)
        .offset(pageOffset);
    }),

  // Get product by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

  // Create product (factory only)
  create: protectedProcedure
    .input(
      z.object({
        nameAr: z.string(),
        nameEn: z.string(),
        nameZh: z.string().optional(),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionZh: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        specifications: z.string().optional(),
        minPrice: z.number(),
        maxPrice: z.number().optional(),
        currency: z.string().default("USD"),
        pricingTiers: z.string().optional(),
        minimumOrderQuantity: z.number().default(1),
        imageUrls: z.string().optional(),
        featured: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify user is a factory
      const factory = await db
        .select()
        .from(factories)
        .where(eq(factories.userId, ctx.user.id))
        .limit(1);

      if (!factory || factory.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only factory owners can create products",
        });
      }

      const result = await db.insert(products).values({
        factoryId: factory[0].id,
        nameAr: input.nameAr,
        nameEn: input.nameEn,
        nameZh: input.nameZh,
        descriptionAr: input.descriptionAr,
        descriptionEn: input.descriptionEn,
        descriptionZh: input.descriptionZh,
        category: input.category,
        tags: input.tags,
        specifications: input.specifications,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        currency: input.currency,
        pricingTiers: input.pricingTiers,
        minimumOrderQuantity: input.minimumOrderQuantity,
        imageUrls: input.imageUrls,
        featured: input.featured,
        active: 1,
      });

      return result;
    }),

  // Update product (factory owner only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nameAr: z.string().optional(),
        nameEn: z.string().optional(),
        nameZh: z.string().optional(),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionZh: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        specifications: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        pricingTiers: z.string().optional(),
        minimumOrderQuantity: z.number().optional(),
        imageUrls: z.string().optional(),
        featured: z.number().optional(),
        active: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify product exists
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);

      if (!product || product.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Verify user is the factory owner
      const factory = await db
        .select()
        .from(factories)
        .where(eq(factories.id, product[0].factoryId))
        .limit(1);

      if (!factory || factory[0].userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot update product that doesn't belong to your factory",
        });
      }

      // Build update object
      const updateData: any = {};
      if (input.nameAr !== undefined) updateData.nameAr = input.nameAr;
      if (input.nameEn !== undefined) updateData.nameEn = input.nameEn;
      if (input.nameZh !== undefined) updateData.nameZh = input.nameZh;
      if (input.descriptionAr !== undefined) updateData.descriptionAr = input.descriptionAr;
      if (input.descriptionEn !== undefined) updateData.descriptionEn = input.descriptionEn;
      if (input.descriptionZh !== undefined) updateData.descriptionZh = input.descriptionZh;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.tags !== undefined) updateData.tags = input.tags;
      if (input.specifications !== undefined) updateData.specifications = input.specifications;
      if (input.minPrice !== undefined) updateData.minPrice = input.minPrice;
      if (input.maxPrice !== undefined) updateData.maxPrice = input.maxPrice;
      if (input.pricingTiers !== undefined) updateData.pricingTiers = input.pricingTiers;
      if (input.minimumOrderQuantity !== undefined) updateData.minimumOrderQuantity = input.minimumOrderQuantity;
      if (input.imageUrls !== undefined) updateData.imageUrls = input.imageUrls;
      if (input.featured !== undefined) updateData.featured = input.featured;
      if (input.active !== undefined) updateData.active = input.active;
      updateData.updatedAt = new Date();

      await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, input.id));

      return { success: true };
    }),

  // Delete product (factory owner only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify product exists
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);

      if (!product || product.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Verify user is the factory owner
      const factory = await db
        .select()
        .from(factories)
        .where(eq(factories.id, product[0].factoryId))
        .limit(1);

      if (!factory || factory[0].userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete product that doesn't belong to your factory",
        });
      }

      await db.delete(products).where(eq(products.id, input.id));

      return { success: true };
    }),

  // Get featured products
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(products)
        .where(and(eq(products.active, 1), eq(products.featured, 1)))
        .orderBy(desc(products.createdAt))
        .limit(input.limit);
    }),

  // Get categories
  getCategories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allProducts = await db.select().from(products).where(eq(products.active, 1));
    const categories = new Set<string>();

    allProducts.forEach((p: any) => {
      if (p.category) categories.add(p.category);
    });

    return Array.from(categories);
  }),
});


