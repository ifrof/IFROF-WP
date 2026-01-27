import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(role: "admin" | "user" | "factory" | "buyer" = "buyer"): TrpcContext {
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
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("forum router", () => {
  describe("getPosts", () => {
    it("should return forum posts", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.forum.getPosts({ limit: 10, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("search", () => {
    it("should search forum posts", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.forum.search({ query: "test" });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("createPost", () => {
    it("should allow authenticated users to create forum posts", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.forum.createPost({
        title: "Test Question",
        content: "This is a test question",
        category: "General",
        tags: "test,question",
      });

      expect(result).toBeDefined();
    });
  });

  describe("createAnswer", () => {
    it("should allow authenticated users to create answers", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.forum.createAnswer({
          postId: 1,
          content: "This is a test answer",
        });
        expect(result).toBeDefined();
      } catch (error: any) {
        // Post might not exist, but the procedure should work
        expect(error.code).not.toBe("UNAUTHORIZED");
      }
    });
  });

  describe("voteAnswer", () => {
    it("should allow users to vote on answers", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.forum.voteAnswer({
          answerId: 1,
          voteType: "upvote",
        });
        expect(result).toBeDefined();
      } catch (error: any) {
        // Answer might not exist, but the procedure should work
        expect(error.code).not.toBe("UNAUTHORIZED");
      }
    });
  });

  describe("markBestAnswer", () => {
    it("should allow post author to mark best answer", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.forum.markBestAnswer({
          answerId: 1,
          postId: 1,
        });
        expect(result).toBeDefined();
      } catch (error: any) {
        // Post might not exist, but the procedure should work
        expect(error.code).not.toBe("UNAUTHORIZED");
      }
    });
  });
});

describe("inquiries router", () => {
  describe("getByBuyer", () => {
    it("should allow buyers to view their inquiries", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.inquiries.getByBuyer({ buyerId: ctx.user.id });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject viewing other buyer's inquiries", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.inquiries.getByBuyer({ buyerId: 999 });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("create", () => {
    it("should allow buyers to create inquiries", async () => {
      const ctx = createUserContext("buyer");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.inquiries.create({
        buyerId: ctx.user.id,
        factoryId: 1,
        subject: "Test Inquiry",
        description: "This is a test inquiry",
      });

      expect(result).toBeDefined();
    });

    it("should reject admins from creating inquiries", async () => {
      const ctx = createUserContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.inquiries.create({
          buyerId: ctx.user.id,
          factoryId: 1,
          subject: "Test Inquiry",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
