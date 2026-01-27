import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { blogPosts } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import type { BlogPost } from "../../drizzle/schema";
import { getCached } from "../utils/cache";
import { TRPCError } from "@trpc/server";

import fs from "fs";
import path from "path";

const JSON_DB_PATH = path.join(process.cwd(), "local_db.json");

function readJsonDb() {
  if (fs.existsSync(JSON_DB_PATH)) {
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, "utf-8"));
  }
  return { blogPosts: [] };
}

const createBlogPostSchema = z.object({
  title: z.string(),
  titleAr: z.string().optional(),
  titleEn: z.string().optional(),
  slug: z.string(),
  content: z.string(),
  contentAr: z.string().optional(),
  contentEn: z.string().optional(),
  excerpt: z.string().optional(),
  excerptAr: z.string().optional(),
  excerptEn: z.string().optional(),
  category: z.string().optional(),
  categoryAr: z.string().optional(),
  categoryEn: z.string().optional(),
  tags: z.string().optional(),
  lang: z.enum(["ar", "en"]).default("ar"),
});

const updateBlogPostSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  titleAr: z.string().optional(),
  titleEn: z.string().optional(),
  content: z.string().optional(),
  contentAr: z.string().optional(),
  contentEn: z.string().optional(),
  excerpt: z.string().optional(),
  excerptAr: z.string().optional(),
  excerptEn: z.string().optional(),
  category: z.string().optional(),
  categoryAr: z.string().optional(),
  categoryEn: z.string().optional(),
  tags: z.string().optional(),
  featured: z.number().optional(),
  published: z.number().optional(),
});

export const blogRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const lang = input.lang || "ar";
      const pageNum = Math.max(1, input.page);
      const pageLimit = Math.min(100, Math.max(1, input.limit));
      const pageOffset = (pageNum - 1) * pageLimit;
      const cacheKey = `blog:list:${lang}:${input.category || "all"}:${input.search || "none"}:${pageNum}`;

      return getCached(
        cacheKey,
        async () => {
          const db = await getDb();

          // Try MySQL first
          if (db && !db.isJsonMode) {
            try {
              const conditions = [eq(blogPosts.published, 1)];

              // Language filtering
              if ((blogPosts as any).lang) {
                conditions.push(eq((blogPosts as any).lang, lang));
              }

              if (input.search) {
                conditions.push(
                  or(
                    like(blogPosts.title, `%${input.search}%`),
                    like((blogPosts as any).titleAr, `%${input.search}%`),
                    like((blogPosts as any).titleEn, `%${input.search}%`)
                  )
                );
              }
              if (input.category) {
                conditions.push(eq(blogPosts.category, input.category));
              }

              return await db
                .select()
                .from(blogPosts)
                .where(and(...conditions))
                .orderBy(desc(blogPosts.createdAt))
                .limit(pageLimit)
                .offset(pageOffset);
            } catch (e) {
              console.warn("MySQL blog list failed, falling back to JSON", e);
            }
          }

          // Fallback to JSON
          const data = readJsonDb();
          const isAr = lang === "ar";

          let posts = (data.blogPosts || []).filter((p: any) => {
            const isPublished = p.published === 1;
            const matchesLang = p.lang === lang || (!p.lang && isAr);
            return isPublished && matchesLang;
          });

          posts = posts.map((p: any) => ({
            ...p,
            title: isAr && p.titleAr ? p.titleAr : p.title,
            excerpt: isAr && p.excerptAr ? p.excerptAr : p.excerpt,
            category: isAr && p.categoryAr ? p.categoryAr : p.category,
          }));

          if (input.search) {
            const search = input.search.toLowerCase();
            posts = posts.filter((p: any) =>
              p.title.toLowerCase().includes(search)
            );
          }

          if (input.category) {
            posts = posts.filter((p: any) => p.category === input.category);
          }

          // Apply pagination
          return posts.slice(pageOffset, pageOffset + pageLimit);
        },
        600
      ); // 10 minutes cache
    }),

  // Get blog post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string(), lang: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const lang = input.lang || "ar";
      const db = await getDb();

      // Try MySQL first
      if (db && !db.isJsonMode) {
        try {
          const posts = await db
            .select()
            .from(blogPosts)
            .where(
              and(eq(blogPosts.slug, input.slug), eq(blogPosts.published, 1))
            )
            .limit(1);
          if (posts.length > 0) {
            const post = posts[0];
            return {
              ...post,
              title:
                lang === "ar" && (post as any).titleAr
                  ? (post as any).titleAr
                  : post.title,
              content:
                lang === "ar" && (post as any).contentAr
                  ? (post as any).contentAr
                  : post.content,
              excerpt:
                lang === "ar" && (post as any).excerptAr
                  ? (post as any).excerptAr
                  : post.excerpt,
              category:
                lang === "ar" && (post as any).categoryAr
                  ? (post as any).categoryAr
                  : post.category,
            };
          }
        } catch (e) {
          console.warn("MySQL blog getBySlug failed, falling back to JSON", e);
        }
      }

      // Fallback to JSON
      const data = readJsonDb();
      const post = (data.blogPosts || []).find(
        (p: any) => p.slug === input.slug && p.published === 1
      );
      if (!post) return null;

      return {
        ...post,
        title: lang === "ar" && post.titleAr ? post.titleAr : post.title,
        content:
          lang === "ar" && post.contentAr ? post.contentAr : post.content,
        excerpt:
          lang === "ar" && post.excerptAr ? post.excerptAr : post.excerpt,
        category:
          lang === "ar" && post.categoryAr ? post.categoryAr : post.category,
      };
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
      // Verify admin role
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create blog posts",
        });
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

  // Update blog post (admin only)
  update: protectedProcedure
    .input(updateBlogPostSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify admin role
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update blog posts",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify post exists
      const post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, input.id))
        .limit(1);

      if (!post || post.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      // Build update object
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.titleAr !== undefined) updateData.titleAr = input.titleAr;
      if (input.titleEn !== undefined) updateData.titleEn = input.titleEn;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.contentAr !== undefined) updateData.contentAr = input.contentAr;
      if (input.contentEn !== undefined) updateData.contentEn = input.contentEn;
      if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
      if (input.excerptAr !== undefined) updateData.excerptAr = input.excerptAr;
      if (input.excerptEn !== undefined) updateData.excerptEn = input.excerptEn;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.categoryAr !== undefined)
        updateData.categoryAr = input.categoryAr;
      if (input.categoryEn !== undefined)
        updateData.categoryEn = input.categoryEn;
      if (input.tags !== undefined) updateData.tags = input.tags;
      if (input.featured !== undefined) updateData.featured = input.featured;
      if (input.published !== undefined) updateData.published = input.published;
      updateData.updatedAt = new Date();

      await db
        .update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, input.id));

      return { success: true };
    }),

  // Delete blog post (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify admin role
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete blog posts",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify post exists
      const post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, input.id))
        .limit(1);

      if (!post || post.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));

      return { success: true };
    }),

  // Get blog categories
  getCategories: publicProcedure
    .input(z.object({ lang: z.string().optional() }))
    .query(async ({ input }) => {
      const lang = input.lang || "ar";
      const db = await getDb();

      if (db && !db.isJsonMode) {
        try {
          const posts = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.published, 1));

          const categories = new Set<string>();
          posts.forEach((post: any) => {
            const category =
              lang === "ar" && post.categoryAr
                ? post.categoryAr
                : post.category;
            if (category) categories.add(category);
          });

          return Array.from(categories);
        } catch (e) {
          console.warn("MySQL getCategories failed, falling back to JSON", e);
        }
      }

      // Fallback to JSON
      const data = readJsonDb();
      const categories = new Set<string>();
      (data.blogPosts || []).forEach((post: any) => {
        if (post.published === 1) {
          const category =
            lang === "ar" && post.categoryAr ? post.categoryAr : post.category;
          if (category) categories.add(category);
        }
      });

      return Array.from(categories);
    }),

  // Get featured posts
  getFeatured: publicProcedure
    .input(
      z.object({ lang: z.string().optional(), limit: z.number().default(5) })
    )
    .query(async ({ input }) => {
      const lang = input.lang || "ar";
      const db = await getDb();

      if (db && !db.isJsonMode) {
        try {
          const posts = await db
            .select()
            .from(blogPosts)
            .where(and(eq(blogPosts.published, 1), eq(blogPosts.featured, 1)))
            .orderBy(desc(blogPosts.createdAt))
            .limit(input.limit);

          return posts.map((post: any) => ({
            ...post,
            title: lang === "ar" && post.titleAr ? post.titleAr : post.title,
            excerpt:
              lang === "ar" && post.excerptAr ? post.excerptAr : post.excerpt,
            category:
              lang === "ar" && post.categoryAr
                ? post.categoryAr
                : post.category,
          }));
        } catch (e) {
          console.warn("MySQL getFeatured failed, falling back to JSON", e);
        }
      }

      // Fallback to JSON
      const data = readJsonDb();
      let posts = (data.blogPosts || [])
        .filter((p: any) => p.published === 1 && p.featured === 1)
        .slice(0, input.limit);

      return posts.map((p: any) => ({
        ...p,
        title: lang === "ar" && p.titleAr ? p.titleAr : p.title,
        excerpt: lang === "ar" && p.excerptAr ? p.excerptAr : p.excerpt,
        category: lang === "ar" && p.categoryAr ? p.categoryAr : p.category,
      }));
    }),
});
