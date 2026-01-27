import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { blogPosts } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import type { BlogPost } from "../../drizzle/schema";

export const blogRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(blogPosts.published, 1)];

      if (input.search) {
        conditions.push(like(blogPosts.title, `%${input.search}%`));
      }

      if (input.category) {
        conditions.push(eq(blogPosts.category, input.category));
      }

      const posts = await db
        .select()
        .from(blogPosts)
        .where(and(...conditions))
        .orderBy(blogPosts.createdAt);

      return posts;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const posts = await db
        .select()
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.slug, input.slug),
            eq(blogPosts.published, 1)
          )
        )
        .limit(1);

      return posts.length > 0 ? posts[0] : null;
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(blogPosts).values({
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt,
        authorId: ctx.user.id,
        category: input.category,
        tags: input.tags,
        published: 0,
      });

      return result;
    }),
});
