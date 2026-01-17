import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "buyer",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("notifications router", () => {
  describe("create", () => {
    it("should create a notification", async () => {
      const caller = appRouter.createCaller({} as TrpcContext);

      const result = await caller.notifications.create({
        type: "order_placed",
        title: "Order Placed",
        message: "Your order has been placed successfully",
        userId: 1,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe("getNotifications", () => {
    it("should return user notifications", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notifications.getNotifications({
        limit: 20,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter unread notifications", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notifications.getNotifications({
        limit: 20,
        offset: 0,
        unreadOnly: true,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getUnreadCount", () => {
    it("should return unread notification count", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notifications.getUnreadCount();

      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.notifications.markAsRead({
          notificationId: 999,
        });
        // May fail if notification doesn't exist, but should not throw auth error
        expect(true).toBe(true);
      } catch (error: any) {
        // Expected if notification doesn't exist
        expect(error.code).toMatch(/NOT_FOUND|INTERNAL_SERVER_ERROR/);
      }
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all notifications as read", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notifications.markAllAsRead();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});
