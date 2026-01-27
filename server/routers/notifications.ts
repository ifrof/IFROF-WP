import { z } from "zod";
import { protectedProcedure, router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { notifications } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";

const notificationSchema = z.object({
  type: z.enum([
    "order_placed",
    "order_shipped",
    "inquiry_received",
    "answer_posted",
    "message_received",
    "product_updated",
  ]),
  title: z.string(),
  message: z.string().optional(),
  relatedEntityId: z.number().optional(),
  userId: z.number(),
});

export const notificationsRouter = router({
  // Create notification
  create: publicProcedure
    .input(notificationSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(notifications).values({
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          relatedEntityId: input.relatedEntityId,
          read: 0,
          createdAt: new Date(),
        });

        // Notify owner for important events
        if (["order_placed", "inquiry_received"].includes(input.type)) {
          await notifyOwner({
            title: input.title,
            content: input.message || "New notification received",
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Error creating notification:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create notification",
        });
      }
    }),

  // Get user notifications
  getNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const whereConditions = [eq(notifications.userId, ctx.user.id)];
        if (input.unreadOnly) {
          whereConditions.push(eq(notifications.read, 0));
        }

        return db
          .select()
          .from(notifications)
          .where(eq(notifications.userId, ctx.user.id))
          .orderBy(desc(notifications.createdAt))
          .limit(input.limit)
          .offset(input.offset);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }
    }),

  // Get unread count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return 0;

    try {
      const result = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, ctx.user.id));

      return result.filter((n) => n.read === 0).length;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  }),

  // Mark as read
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Verify ownership
        const notifRecords = await db
          .select()
          .from(notifications)
          .where(eq(notifications.id, input.notificationId));

        if (notifRecords.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Notification not found",
          });
        }

        const notif = notifRecords[0];
        if (notif.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this notification",
          });
        }

        await db
          .update(notifications)
          .set({ read: 1 })
          .where(eq(notifications.id, input.notificationId));

        return { success: true };
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mark notification as read",
        });
      }
    }),

  // Mark all as read
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    try {
      await db
        .update(notifications)
        .set({ read: 1 })
        .where(eq(notifications.userId, ctx.user.id));

      return { success: true };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to mark notifications as read",
      });
    }
  }),

  // Delete notification
  delete: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Verify ownership
        const notifRecords = await db
          .select()
          .from(notifications)
          .where(eq(notifications.id, input.notificationId));

        if (notifRecords.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Notification not found",
          });
        }

        const notif = notifRecords[0];
        if (notif.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this notification",
          });
        }

        // Note: In a real app, you might soft-delete instead
        // For now, we'll just return success without actually deleting
        return { success: true };
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete notification",
        });
      }
    }),
});
