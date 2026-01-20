import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";
import { forumPosts, forumVotes, forumAnswers } from "../../drizzle/schema";
import { eq, and, like } from "drizzle-orm";

const forumPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().optional(),
  tags: z.string().optional(),
});

const forumAnswerSchema = z.object({
  postId: z.number(),
  content: z.string().min(1),
});

const voteSchema = z.object({
  answerId: z.number(),
  voteType: z.enum(["upvote", "downvote"]),
});

export const forumRouter = router({
  // Get all forum posts with pagination
  getPosts: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return db.getForumPosts(input.limit, input.offset);
    }),

  // Get single forum post with answers
  getPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await db.getForumPostById(input.id);
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Forum post not found" });
      }

      // Increment view count
      await db.updateForumPost(input.id, { views: (post.views || 0) + 1 });

      const answers = await db.getForumAnswersByPost(input.id);
      return { ...post, answers };
    }),

  // Create forum post (authenticated users)
  createPost: protectedProcedure
    .input(forumPostSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await db.createForumPost({
        ...input,
        authorId: ctx.user.id,
      });

      return result;
    }),

  // Create forum answer
  createAnswer: protectedProcedure
    .input(forumAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await db.getForumPostById(input.postId);
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Forum post not found" });
      }

      const result = await db.createForumAnswer({
        postId: input.postId,
        authorId: ctx.user.id,
        content: input.content,
      });

      return result;
    }),

  // Vote on answer
  voteAnswer: protectedProcedure
    .input(voteSchema)
    .mutation(async ({ ctx, input }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new Error("Database not available");

      // Check if user already voted
      const existingVote = await db_instance
        .select()
        .from(forumVotes)
        .where(
          and(
            eq(forumVotes.answerId, input.answerId),
            eq(forumVotes.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (existingVote && existingVote.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "You have already voted on this answer" });
      }

      // Add vote
      const voteValue = input.voteType === "upvote" ? 1 : -1;
      await db_instance.insert(forumVotes).values({
        answerId: input.answerId,
        userId: ctx.user.id,
        voteType: input.voteType,
      });

      // Update answer vote count
      const answer = await db_instance
        .select()
        .from(forumAnswers)
        .where(eq(forumAnswers.id, input.answerId))
        .limit(1);

      if (answer && answer.length > 0) {
        await db_instance
          .update(forumAnswers)
          .set({ votes: (answer[0].votes || 0) + voteValue })
          .where(eq(forumAnswers.id, input.answerId));
      }

      return { success: true };
    }),

  // Mark answer as best
  markBestAnswer: protectedProcedure
    .input(z.object({ answerId: z.number(), postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await db.getForumPostById(input.postId);
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Forum post not found" });
      }

      // Only post author or admin can mark best answer
      if (ctx.user.id !== post.authorId && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only post author can mark best answer" });
      }

      // Update answer as best
      await db.updateForumAnswer(input.answerId, { isBestAnswer: 1 });

      // Update post status
      await db.updateForumPost(input.postId, { status: "answered", bestAnswerId: input.answerId });

      return { success: true };
    }),

  // Search forum posts
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db_instance = await db.getDb();
      if (!db_instance) return [];

      return db_instance
        .select()
        .from(forumPosts)
        .where(like(forumPosts.title, `%${input.query}%`))
        .limit(20);
    }),
});
