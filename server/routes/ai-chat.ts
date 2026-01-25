import type { Request, Response } from "express";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ENV } from "../_core/env";
import { aiDailyCap, aiRateLimiter, requireAuth } from "../middleware/ai-guardrails";

export function registerAiChatRoutes(app: { post: (path: string, ...handlers: any[]) => void }) {
  app.post("/api/ai/chat", requireAuth, aiRateLimiter, aiDailyCap, async (req: Request, res: Response) => {
    try {
      const { messages } = req.body as { messages?: Array<{ role: string; content: string }> };

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }

      const result = await streamText({
        model: openai(ENV.aiModel),
        messages: messages.map(message => ({
          role: message.role as "system" | "user" | "assistant",
          content: message.content,
        })),
      });

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");

      for await (const chunk of result.textStream) {
        res.write(chunk);
      }
      res.end();

      if ((req as any).trackAiCost && result.usage?.totalTokens) {
        await (req as any).trackAiCost(result.usage.totalTokens);
      }
    } catch (error) {
      console.error("[AI Chat] Streaming error", error);
      res.status(500).json({ error: "AI streaming failed" });
    }
  });
}
