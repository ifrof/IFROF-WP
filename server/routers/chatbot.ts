import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { chatMessages } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";

const messageSchema = z.object({
  content: z.string().min(1),
  sessionId: z.string(),
});

const systemPrompt = `You are a helpful AI assistant for an industrial marketplace platform that connects buyers directly with factories. 
Your role is to:
1. Help buyers find suitable factories and products
2. Answer questions about products, manufacturing, and ordering
3. Guide buyers through the inquiry process
4. Provide information about certifications, production capacity, and minimum order quantities
5. Suggest factories based on buyer requirements
6. Answer general questions about the platform

Be professional, helpful, and concise. When you don't have specific information, suggest the buyer contact factories directly or check the forum for community advice.`;

export const chatbotRouter = router({
  // Send message and get AI response
  sendMessage: protectedProcedure
    .input(messageSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get conversation history
      const history = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId));

      // Build messages for LLM
      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt },
        ...history.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: input.content },
      ];

      // Get AI response
      const response = await invokeLLM({
        messages: messages,
      });

      const aiContent = typeof response.choices[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : "I apologize, I could not generate a response. Please try again.";

      // Save AI response
      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        role: "assistant",
        content: aiContent,
        sessionId: input.sessionId,
      });

      return {
        userMessage: input.content,
        aiResponse: aiContent,
        sessionId: input.sessionId,
      };
    }),

  // Get chat history
  getHistory: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId));
    }),

  // Get all sessions for a user
  getSessions: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.userId, ctx.user.id));

      // Group by session and get latest message
      const sessions = new Map<string, typeof messages[0]>();
      messages.forEach((msg) => {
        const existing = sessions.get(msg.sessionId);
        if (!existing || msg.createdAt > existing.createdAt) {
          sessions.set(msg.sessionId, msg);
        }
      });

      return Array.from(sessions.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }),

  // Clear chat history
  clearHistory: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Note: In production, you would want to soft-delete or archive
      // For now, we will just return success
      return { success: true };
    }),
});
