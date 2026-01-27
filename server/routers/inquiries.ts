import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";
import { messages } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

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
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot view other buyer's requests",
        });
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
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "pending",
          "quoted",
          "accepted",
          "paid",
          "shipped",
          "cancelled",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await db.updateImportRequest(input.id, {
        status: input.status,
      });

      // Send notification to buyer
      const request = await db.getImportRequestById(input.id);
      if (request) {
        const buyer = await db.getUserById(request.buyerId);
        if (buyer) {
          await sendImportRequestUpdateEmail(
            buyer.email,
            buyer.fullName || buyer.username,
            input.id.toString(),
            input.status,
            request.productName || "Product"
          );
        }
      }

      return updated;
    }),

  // Submit a quote (factory only)
  submitQuote: protectedProcedure
    .input(quoteSchema)
    .mutation(async ({ ctx, input }) => {
      const quote = await db.createQuote(input);
      await db.updateImportRequest(input.requestId, { status: "quoted" });

      // Send notification to buyer
      const request = await db.getImportRequestById(input.requestId);
      if (request) {
        const buyer = await db.getUserById(request.buyerId);
        if (buyer) {
          await sendImportRequestUpdateEmail(
            buyer.email,
            buyer.fullName || buyer.username,
            input.requestId.toString(),
            "quoted",
            request.productName || "Product"
          );
        }
      }

      return quote;
    }),

  // Get quotes for a request
  getQuotes: protectedProcedure
    .input(z.object({ requestId: z.number() }))
    .query(async ({ ctx, input }) => {
      return db.getQuotesByRequest(input.requestId);
    }),
});

export const messagesRouter = router({
  // Get messages for an inquiry
  getByInquiry: protectedProcedure
    .input(z.object({ inquiryId: z.number() }))
    .query(async ({ ctx, input }) => {
      // In a real app, verify the user is part of this conversation
      const db_instance = await db.getDb();
      if (!db_instance) return [];

      return db_instance
        .select()
        .from(messages)
        .where(eq(messages.inquiryId, input.inquiryId));
    }),

  // Send message in an inquiry
  send: protectedProcedure
    .input(messageSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify user is part of this conversation
      if (ctx.user.id !== input.senderId && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot send message as another user",
        });
      }

      const db_instance = await db.getDb();
      if (!db_instance) throw new Error("Database not available");

      return db_instance.insert(messages).values({
        inquiryId: input.inquiryId,
        senderId: input.senderId,
        receiverId: input.receiverId,
        content: input.content,
        attachments: input.attachments,
        read: 0,
        createdAt: new Date(),
      });
    }),

  // Mark message as read
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new Error("Database not available");

      return db_instance
        .update(messages)
        .set({ read: 1 })
        .where(eq(messages.id, input.messageId));
    }),

  // Get unread message count for a user
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db_instance = await db.getDb();
    if (!db_instance) return 0;

    const unread = await db_instance
      .select()
      .from(messages)
      .where(and(eq(messages.receiverId, ctx.user.id), eq(messages.read, 0)));

    return unread?.length || 0;
  }),
});
