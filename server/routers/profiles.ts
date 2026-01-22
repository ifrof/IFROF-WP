import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { buyerProfiles, factories, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const updateBuyerProfileSchema = z.object({
  companyName: z.string().optional(),
  businessType: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  interests: z.string().optional(), // JSON array of product categories
});

const updateFactoryProfileSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  certifications: z.string().optional(),
  productCategories: z.string().optional(),
  productionCapacity: z.string().optional(),
  minimumOrderQuantity: z.number().optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  certificationProofs: z.string().optional(), // JSON array of certification URLs
});

export const profilesRouter = router({
  // Get buyer profile
  getBuyerProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const profile = await db
      .select()
      .from(buyerProfiles)
      .where(eq(buyerProfiles.userId, ctx.user.id))
      .limit(1);

    if (profile.length === 0) {
      // Create empty profile if it doesn't exist
      await db.insert(buyerProfiles).values({
        userId: ctx.user.id,
      });
      return {
        userId: ctx.user.id,
        companyName: null,
        businessType: null,
        address: null,
        city: null,
        country: null,
        zipCode: null,
        interests: null,
      };
    }

    return profile[0];
  }),

  // Update buyer profile
  updateBuyerProfile: protectedProcedure
    .input(updateBuyerProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if profile exists
      const existing = await db
        .select()
        .from(buyerProfiles)
        .where(eq(buyerProfiles.userId, ctx.user.id))
        .limit(1);

      if (existing.length === 0) {
        // Create new profile
        await db.insert(buyerProfiles).values({
          userId: ctx.user.id,
          ...input,
        });
      } else {
        // Update existing profile
        const updateData: any = {};
        if (input.companyName !== undefined) updateData.companyName = input.companyName;
        if (input.businessType !== undefined) updateData.businessType = input.businessType;
        if (input.address !== undefined) updateData.address = input.address;
        if (input.city !== undefined) updateData.city = input.city;
        if (input.country !== undefined) updateData.country = input.country;
        if (input.zipCode !== undefined) updateData.zipCode = input.zipCode;
        if (input.interests !== undefined) updateData.interests = input.interests;
        updateData.updatedAt = new Date();

        await db
          .update(buyerProfiles)
          .set(updateData)
          .where(eq(buyerProfiles.userId, ctx.user.id));
      }

      return { success: true };
    }),

  // Get factory profile
  getFactoryProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const profile = await db
      .select()
      .from(factories)
      .where(eq(factories.userId, ctx.user.id))
      .limit(1);

    return profile.length > 0 ? profile[0] : null;
  }),

  // Create factory profile
  createFactoryProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        certifications: z.string().optional(),
        productCategories: z.string().optional(),
        productionCapacity: z.string().optional(),
        minimumOrderQuantity: z.number().optional(),
        logoUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if factory profile already exists
      const existing = await db
        .select()
        .from(factories)
        .where(eq(factories.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Factory profile already exists for this user",
        });
      }

      await db.insert(factories).values({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        location: input.location,
        latitude: input.latitude,
        longitude: input.longitude,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        certifications: input.certifications,
        productCategories: input.productCategories,
        productionCapacity: input.productionCapacity,
        minimumOrderQuantity: input.minimumOrderQuantity,
        logoUrl: input.logoUrl,
        bannerUrl: input.bannerUrl,
        verificationStatus: "pending",
        rating: 0,
      });

      return { success: true };
    }),

  // Update factory profile
  updateFactoryProfile: protectedProcedure
    .input(updateFactoryProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get factory for this user
      const factory = await db
        .select()
        .from(factories)
        .where(eq(factories.userId, ctx.user.id))
        .limit(1);

      if (!factory || factory.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Factory profile not found",
        });
      }

      // Build update object
      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.location !== undefined) updateData.location = input.location;
      if (input.latitude !== undefined) updateData.latitude = input.latitude;
      if (input.longitude !== undefined) updateData.longitude = input.longitude;
      if (input.contactEmail !== undefined) updateData.contactEmail = input.contactEmail;
      if (input.contactPhone !== undefined) updateData.contactPhone = input.contactPhone;
      if (input.certifications !== undefined) updateData.certifications = input.certifications;
      if (input.productCategories !== undefined) updateData.productCategories = input.productCategories;
      if (input.productionCapacity !== undefined) updateData.productionCapacity = input.productionCapacity;
      if (input.minimumOrderQuantity !== undefined) updateData.minimumOrderQuantity = input.minimumOrderQuantity;
      if (input.logoUrl !== undefined) updateData.logoUrl = input.logoUrl;
      if (input.bannerUrl !== undefined) updateData.bannerUrl = input.bannerUrl;
      if (input.certificationProofs !== undefined) updateData.certificationProofs = input.certificationProofs;
      updateData.updatedAt = new Date();

      await db
        .update(factories)
        .set(updateData)
        .where(eq(factories.id, factory[0].id));

      return { success: true };
    }),

  // Update user profile (name, email)
  updateUserProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.email !== undefined) updateData.email = input.email;
      if (input.phone !== undefined) updateData.phone = input.phone;
      updateData.updatedAt = new Date();

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),

  // Get user profile
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (user.length === 0) return null;

    const { password, ...userWithoutPassword } = user[0];
    return userWithoutPassword;
  }),

  // Get public factory profile
  getPublicFactoryProfile: protectedProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const profile = await db
        .select()
        .from(factories)
        .where(eq(factories.id, input.factoryId))
        .limit(1);

      return profile.length > 0 ? profile[0] : null;
    }),
});
