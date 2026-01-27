import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { chatMessages } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, desc } from "drizzle-orm";

const messageSchema = z.object({
  content: z.string().min(1),
  sessionId: z.string(),
});

const systemPromptEn = `You are the IFROF AI Factory Investigator, a highly intelligent and specialized assistant for the IFROF industrial marketplace. Your primary goal is to help buyers source products and verify Chinese manufacturers.

Your expertise includes:
1.  **Direct Factory Sourcing:** Emphasize that IFROF connects buyers directly to verified factories, eliminating middlemen.
2.  **Verification:** Explain the AI-powered verification process (checking business licenses, production capacity, trade history) to ensure the manufacturer is direct and reliable.
3.  **Product & Manufacturing:** Answer questions about product specifications, materials, manufacturing processes, and quality control.
4.  **Ordering Process:** Guide the user through import requests, minimum order quantities (MOQ), and payment terms.
5.  **Platform Features:** Provide information about IFROF's support (24/7), secure payment, and logistics tracking.

**Instructions:**
- Be professional, highly informative, and concise.
- **Crucially, if the user asks a question in Arabic, respond entirely in Arabic. If the user asks in English, respond entirely in English.**
- If you cannot find specific information, suggest they submit an import request or contact IFROF support.
- Do not use any external links.`;

const systemPromptAr = `أنت محقق IFROF الذكي للمصانع، مساعد ذكي ومتخصص للغاية لمنصة IFROF الصناعية. هدفك الأساسي هو مساعدة المشترين في تحديد مصادر المنتجات والتحقق من المصانع الصينية.

تشمل خبرتك ما يلي:
1.  **التوريد المباشر من المصنع:** أكد على أن IFROF يربط المشترين مباشرة بالمصانع الموثوقة، مما يلغي دور الوسطاء.
2.  **التحقق:** اشرح عملية التحقق المدعومة بالذكاء الاصطناعي (فحص التراخيص التجارية، القدرة الإنتاجية، السجل التجاري) لضمان أن المصنع مباشر وموثوق.
3.  **المنتجات والتصنيع:** أجب عن الأسئلة المتعلقة بمواصفات المنتجات، المواد، عمليات التصنيع، ومراقبة الجودة.
4.  **عملية الطلب:** وجه المستخدم خلال عملية طلبات الاستيراد، الحد الأدنى لكميات الطلب (MOQ)، وشروط الدفع.
5.  **ميزات المنصة:** قدم معلومات حول دعم IFROF (24/7)، الدفع الآمن، وتتبع الشحن.

**التعليمات:**
- كن محترفًا، غنيًا بالمعلومات، وموجزًا.
- **الأهم:** إذا طرح المستخدم سؤالاً باللغة العربية، أجب بالكامل باللغة العربية. إذا طرح المستخدم سؤالاً باللغة الإنجليزية، أجب بالكامل باللغة الإنجليزية.
- إذا لم تتمكن من العثور على معلومات محددة، فاقترح عليهم تقديم طلب استيراد أو الاتصال بدعم IFROF.
- لا تستخدم أي روابط خارجية.`;

// Simple language detection function (placeholder for a more robust solution)
function detectLanguage(text: string): "ar" | "en" {
  // Check for common Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/;
  if (arabicRegex.test(text)) {
    return "ar";
  }
  return "en";
}

export const chatbotRouter = router({
  // Send message and get AI response
  sendMessage: protectedProcedure
    .input(messageSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // 1. Save the user's message
      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        role: "user",
        content: input.content,
        sessionId: input.sessionId,
      });

      // 2. Get conversation history (last 10 messages for context)
      const history = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(10); // Limit to last 10 messages for better focus

      // 3. Determine language and select system prompt
      const userLang = detectLanguage(input.content);
      const systemPrompt = userLang === "ar" ? systemPromptAr : systemPromptEn;

      // 4. Build messages for LLM
      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [
        { role: "system", content: systemPrompt },
        // History is reversed because we fetched it in descending order (newest first)
        ...history.reverse().map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ];

      // 5. Get AI response
      const response = await invokeLLM({
        messages: messages,
      });

      const aiContent =
        typeof response.choices[0]?.message?.content === "string"
          ? response.choices[0].message.content
          : userLang === "ar"
            ? "أعتذر، لم أتمكن من توليد استجابة. يرجى المحاولة مرة أخرى."
            : "I apologize, I could not generate a response. Please try again.";

      // 6. Save AI response
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
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(desc(chatMessages.createdAt)); // Return in descending order (newest first)
    }),

  // Get all sessions for a user
  getSessions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, ctx.user.id));

    // Group by session and get latest message
    const sessions = new Map<string, (typeof messages)[0]>();
    messages.forEach((msg: any) => {
      const existing = sessions.get(msg.sessionId);
      if (!existing || msg.createdAt > existing.createdAt) {
        sessions.set(msg.sessionId, msg);
      }
    });

    return Array.from(sessions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
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
