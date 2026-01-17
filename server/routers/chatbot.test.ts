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

describe("chatbot router", () => {
  describe("getHistory", () => {
    it("should return chat history for a session", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chatbot.getHistory({
        sessionId: "test-session-123",
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getSessions", () => {
    it("should return all sessions for a user", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chatbot.getSessions();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("clearHistory", () => {
    it("should allow users to clear chat history", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chatbot.clearHistory({
        sessionId: "test-session-123",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});
