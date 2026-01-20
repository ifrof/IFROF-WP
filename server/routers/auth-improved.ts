import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb, getUsersTable, upsertUser } from "../db";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import crypto from "crypto";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["buyer", "factory", "admin", "user"]).default("buyer"),
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["buyer", "factory", "admin", "user"]).default("buyer"),
});

export const authImprovedRouter = router({
  // Get current user
  me: publicProcedure.query(opts => opts.ctx.user),

  // Login
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const usersTable = getUsersTable() as any;

      // Find user by email
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, input.email))
        .limit(1);

      if (!user) {
        throw new Error("User not found / المستخدم غير موجود");
      }

      // Update last signed in
      await db.update(usersTable)
        .set({ lastSignedIn: new Date() })
        .where(eq(usersTable.id, user.id));

      // Set session cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, user.openId, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return user;
    }),

  // Sign Up
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const openId = crypto.randomBytes(16).toString("hex");
      
      const newUser = await upsertUser({
        email: input.email,
        name: input.name,
        role: input.role,
        openId: openId,
        loginMethod: "email",
      });

      if (!newUser) {
        throw new Error("Failed to create user / فشل إنشاء الحساب");
      }

      // Set session cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, newUser.openId, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return newUser;
    }),

  // Logout
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});
