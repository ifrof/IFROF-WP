import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

const inquirySchema = z.object({
  buyerId: z.number(),
  factoryId: z.number(),
  productId: z.number().optional(),
  subject: z.string().min(1),
  description: z.string().optional(),
  specifications: z.string().optional(),
  quantityRequired: z.number().optional(),
});

const messageSchema = z.object({
  inquiryId: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  content: z.string().min(1),
  attachments: z.string().optional(),
});

export const inquiriesRouter = router({
  // Get inquiries for a factory (factory owner only)
  getByFactory: protectedProcedure
    .input(z.object({ factoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      // In a real app, verify the user owns this factory
      return db.getInquiriesByFactory(input.factoryId);
    }),

  // Get inquiries for a buyer (buyer only)
  getByBuyer: protectedProcedure
    .input(z.object({ buyerId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.id !== input.buyerId && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot view other buyer's inquiries" });
      }
      return db.getInquiriesByBuyer(input.buyerId);
    }),

  // Create inquiry (buyers only)
  create: protectedProcedure
    .input(inquirySchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admins cannot create inquiries" });
      }

      const result = await db.createInquiry({
        ...input,
        buyerId: ctx.user.id,
      });

      return result;
    }),

  // Update inquiry status (factory owner or admin)
  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["pending", "responded", "negotiating", "completed", "cancelled"]) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "factory") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only factory owners can update inquiry status" });
      }

      const result = await db.updateInquiry(input.id, { status: input.status });
      return result;
    }),
});

export const messagesRouter = router({
  // Get messages for an inquiry
  getByInquiry: protectedProcedure
    .input(z.object({ inquiryId: z.number() }))
    .query(async ({ ctx, input }) => {
      // In a real app, verify the user is part of this conversation
      const messages = await db.getDb().then(db => {
        if (!db) return [];
        const { messages: messagesTable } = require("../../drizzle/schema");
        return db.select().from(messagesTable).where(
          require("drizzle-orm").eq(messagesTable.inquiryId, input.inquiryId)
        );
      });
      return messages || [];
    }),

  // Send message in an inquiry
  send: protectedProcedure
    .input(messageSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify user is part of this conversation
      if (ctx.user.id !== input.senderId && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot send message as another user" });
      }

      const result = await db.getDb().then(async db => {
        if (!db) throw new Error("Database not available");
        const { messages: messagesTable } = require("../../drizzle/schema");
        return db.insert(messagesTable).values({
          inquiryId: input.inquiryId,
          senderId: input.senderId,
          receiverId: input.receiverId,
          content: input.content,
          attachments: input.attachments,
          read: 0,
          createdAt: new Date(),
        });
      });

      return result;
    }),

  // Mark message as read
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.getDb().then(async db => {
        if (!db) throw new Error("Database not available");
        const { messages: messagesTable } = require("../../drizzle/schema");
        return db.update(messagesTable).set({ read: 1 }).where(
          require("drizzle-orm").eq(messagesTable.id, input.messageId)
        );
      });

      return result;
    }),

  // Get unread message count for a user
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const result = await db.getDb().then(async db => {
        if (!db) return 0;
        const { messages: messagesTable } = require("../../drizzle/schema");
        const unread = await db.select().from(messagesTable).where(
          require("drizzle-orm").and(
            require("drizzle-orm").eq(messagesTable.receiverId, ctx.user.id),
            require("drizzle-orm").eq(messagesTable.read, 0)
          )
        );
        return unread?.length || 0;
      });

      return result || 0;
    }),
});
