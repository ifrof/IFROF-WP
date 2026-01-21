import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { blogPosts } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import type { BlogPost } from "../../drizzle/schema";
import { getCached } from "../utils/cache";

import fs from "fs";
import path from "path";

const JSON_DB_PATH = path.join(process.cwd(), "local_db.json");

function readJsonDb() {
  if (fs.existsSync(JSON_DB_PATH)) {
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
  }
  return { blogPosts: [] };
}

export const blogRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `blog:list:${input.category || 'all'}:${input.search || 'none'}`;
      
      return getCached(cacheKey, async () => {
        const db = await getDb();
        
        // Try MySQL first
        if (db && !db.isJsonMode) {
        try {
          const conditions = [eq(blogPosts.published, 1)];
          if (input.search) conditions.push(like(blogPosts.title, `%${input.search}%`));
          if (input.category) conditions.push(eq(blogPosts.category, input.category));
          
          return await db
            .select()
            .from(blogPosts)
            .where(and(...conditions))
            .orderBy(blogPosts.createdAt);
        } catch (e) {
          console.warn("MySQL blog list failed, falling back to JSON", e);
        }
      }

      // Fallback to JSON
      const data = readJsonDb();
      let posts = (data.blogPosts || []).filter((p: any) => p.published === 1);
      
      // Map to correct language if needed
      const isAr = true; // Default to AR for now or detect from context
      
      posts = posts.map((p: any) => ({
        ...p,
        title: (isAr && p.titleAr) ? p.titleAr : p.title,
        excerpt: (isAr && p.excerptAr) ? p.excerptAr : p.excerpt,
        category: (isAr && p.categoryAr) ? p.categoryAr : p.category,
      }));

      if (input.search) {
        const search = input.search.toLowerCase();
        posts = posts.filter((p: any) => p.title.toLowerCase().includes(search));
      }
      
      if (input.category) {
        posts = posts.filter((p: any) => p.category === input.category);
      }
      
      return posts;
      }, 600); // 10 minutes
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      
      // Try MySQL first
      if (db && !db.isJsonMode) {
        try {
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
          if (posts.length > 0) return posts[0];
        } catch (e) {
          console.warn("MySQL blog getBySlug failed, falling back to JSON", e);
        }
      }

      // Fallback to JSON
      const data = readJsonDb();
      const post = (data.blogPosts || []).find((p: any) => p.slug === input.slug && p.published === 1);
      if (!post) return null;

      const isAr = ctx.req.headers['accept-language']?.includes('ar') || true;
      return {
        ...post,
        title: (isAr && post.titleAr) ? post.titleAr : post.title,
        content: (isAr && post.contentAr) ? post.contentAr : post.content,
        excerpt: (isAr && post.excerptAr) ? post.excerptAr : post.excerpt,
        category: (isAr && post.categoryAr) ? post.categoryAr : post.category,
      };
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
