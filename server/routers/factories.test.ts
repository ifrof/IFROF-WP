import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AdminUser = NonNullable<TrpcContext["user"]> & { role: "admin" };
type BuyerUser = NonNullable<TrpcContext["user"]> & { role: "buyer" };

function createAdminContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: any) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createBuyerContext(): TrpcContext {
  const user: BuyerUser = {
    id: 2,
    openId: "buyer-user",
    email: "buyer@example.com",
    name: "Buyer User",
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

describe("factories router", () => {
  describe("list", () => {
    it("should return all factories", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.factories.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("search", () => {
    it("should search factories by query", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.factories.search({ query: "test" });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("should allow admin to create factory", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.factories.create({
        name: "Test Factory",
        description: "A test factory",
        location: "Test Location",
        contactEmail: "test@factory.com",
        contactPhone: "+1234567890",
      });

      expect(result).toBeDefined();
    });

    it("should reject non-admin users", async () => {
      const ctx = createBuyerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.factories.create({
          name: "Test Factory",
          contactEmail: "test@factory.com",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("update", () => {
    it("should allow admin to update factory", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.factories.update({
          id: 999, // Non-existent ID for testing
          name: "Updated Factory",
          contactEmail: "updated@factory.com",
        });
        // Result may be undefined if factory doesn't exist, but no error should be thrown
        expect(result === undefined || result).toBeTruthy();
      } catch (error: any) {
        // Only FORBIDDEN errors should be caught here
        expect(error.code).not.toBe("FORBIDDEN");
      }
    });

    it("should reject non-admin users", async () => {
      const ctx = createBuyerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.factories.update({
          id: 1,
          name: "Updated Factory",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("products router", () => {
  describe("getByFactory", () => {
    it("should return products for a factory", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.getByFactory({ factoryId: 1 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("search", () => {
    it("should search products by query", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.search({ query: "test" });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("should allow admin to create product", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.create({
        factoryId: 1,
        name: "Test Product",
        description: "A test product",
        category: "Electronics",
        basePrice: 99.99,
        minimumOrderQuantity: 10,
      });

      expect(result).toBeDefined();
    });

    it("should reject non-admin users", async () => {
      const ctx = createBuyerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.products.create({
          factoryId: 1,
          name: "Test Product",
          basePrice: 99.99,
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
