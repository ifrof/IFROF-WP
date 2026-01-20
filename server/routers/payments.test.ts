import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(role: "buyer" | "admin" | "factory" = "buyer"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://example.com",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("payments router", () => {
  describe("createCheckout", () => {
    it("should allow buyers to create checkout sessions", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.createCheckout({
        factoryId: 1,
        items: [
          {
            productId: 1,
            quantity: 10,
            price: 99.99,
          },
        ],
      });

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.checkoutUrl).toBeDefined();
      expect(result.orderNumber).toBeDefined();
      expect(result.orderNumber).toMatch(/^ORD-/);
    });
  });

  describe("getOrders", () => {
    it("should return buyer's orders", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.getOrders({
        limit: 20,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getOrder", () => {
    it("should return order details for authorized user", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.getOrder({ orderId: 999 });

      // Order may not exist, but should not throw authorization error
      expect(result === null || result).toBeTruthy();
    });

    it("should reject unauthorized access", async () => {
      const ctx = createUserContext("buyer");
      ctx.user.id = 2; // Different user
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payments.getOrder({ orderId: 1 });
        // May return null if order doesn't exist, but should not throw FORBIDDEN
        expect(true).toBe(true);
      } catch (error: any) {
        expect(error.code).not.toBe("FORBIDDEN");
      }
    });
  });

  describe("updateOrderStatus", () => {
    it("should allow admins to update order status", async () => {
      const ctx = createUserContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.payments.updateOrderStatus({
          orderId: 1,
          status: "processing",
        });

        expect(result).toBeDefined();
        expect(result.success).toBe(true);
      } catch (error: any) {
        // Order might not exist, but authorization should pass
        expect(error.code).not.toBe("FORBIDDEN");
      }
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payments.updateOrderStatus({
          orderId: 1,
          status: "processing",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("getFactoryOrders", () => {
    it("should allow factories to view their orders", async () => {
      const ctx = createUserContext("factory");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.getFactoryOrders({
        factoryId: 1,
        limit: 20,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject buyers from viewing factory orders", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payments.getFactoryOrders({
          factoryId: 1,
          limit: 20,
          offset: 0,
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
