import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb, getUsersTable, upsertUser } from "../db";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

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
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const db = await getDb();

    let user;

    // Try MySQL first
    if (db && !db.isJsonMode) {
      try {
        const usersTable = getUsersTable() as any;
        const [dbUser] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, input.email))
          .limit(1);
        user = dbUser;

        if (user) {
          const isPasswordValid =
            input.password && user.password
              ? await bcrypt.compare(input.password, user.password)
              : false;
          if (!isPasswordValid) {
            user = null;
          } else {
            await db
              .update(usersTable)
              .set({ lastSignedIn: new Date() })
              .where(eq(usersTable.id, user.id));
          }
        }
      } catch (e) {
        console.warn("MySQL login failed, falling back to JSON", e);
      }
    }

    // Fallback to JSON
    if (!user) {
      const localDbPath = path.join(process.cwd(), "local_db.json");
      if (fs.existsSync(localDbPath)) {
        const data = JSON.parse(fs.readFileSync(localDbPath, "utf-8"));
        user = data.users.find((u: any) => u.email === input.email);

        if (user) {
          const isPasswordValid =
            input.password && user.password
              ? await bcrypt.compare(input.password, user.password)
              : false;
          if (!isPasswordValid) {
            user = null;
          } else {
            user.lastSignedIn = new Date().toISOString();
            fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
          }
        }
      }
    }

    // EMERGENCY BYPASS FOR ADMIN
    if (!user && input.email === "ifrof4@gmail.com" && input.password === "IFROF_Admin_2026_Secure_Strong!") {
      console.log("EMERGENCY BYPASS TRIGGERED FOR ADMIN");
      user = {
        id: 999,
        email: "ifrof4@gmail.com",
        role: "admin",
        name: "Hady Essam",
        openId: "admin_prod_2026",
        loginMethod: "email"
      };
    }

    if (!user) {
      console.error(`LOGIN_FAILED: User not found or password mismatch for ${input.email}`);
      throw new Error(
        "User not found or incorrect credentials / المستخدم غير موجود أو بيانات الدخول خاطئة"
      );
    }

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

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUser = await upsertUser({
        email: input.email,
        name: input.name,
        role: input.role,
        openId: openId,
        password: hashedPassword,
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
