import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { getDb, getUserByEmail, upsertUser, getUserByVerificationToken, getUserByResetToken, createSession, deleteSession } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendVerificationEmail, sendPasswordResetEmail } from "../_core/email-service";

const registerSchema = z.object({
  email: z.string().email("Invalid email format / تنسيق البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "Password must be at least 8 characters / يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[0-9]/, "Password must contain a number / يجب أن تحتوي كلمة المرور على رقم")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character / يجب أن تحتوي كلمة المرور على رمز خاص"),
  name: z.string().min(2, "Name is too short / الاسم قصير جداً"),
  phone: z.string().optional(),
  role: z.enum(["buyer", "factory"]).default("buyer"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format / تنسيق البريد الإلكتروني غير صحيح"),
  password: z.string(),
  rememberMe: z.boolean().default(false),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters / يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[0-9]/, "Password must contain a number / يجب أن تحتوي كلمة المرور على رقم")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character / يجب أن تحتوي كلمة المرور على رمز خاص"),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/),
});

export const authRouter = router({
  // Get current user
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user || null;
  }),

  // Register
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await getUserByEmail(input.email);
      if (existingUser) {
        throw new Error("Email already registered / البريد الإلكتروني مسجل بالفعل");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const openId = crypto.randomBytes(16).toString("hex");
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const newUser = await upsertUser({
        email: input.email,
        password: hashedPassword,
        name: input.name,
        phone: input.phone,
        role: input.role,
        openId: openId,
        loginMethod: "email",
        emailVerified: 0,
        verificationToken,
        verificationTokenExpires,
      });

      if (!newUser) {
        throw new Error("Failed to create user / فشل إنشاء الحساب");
      }

      // Send verification email
      try {
        await sendVerificationEmail(newUser.email, newUser.name, verificationToken);
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }

      // Set session cookie (auto-login)
      const sessionToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      await createSession({
        id: sessionToken,
        userId: newUser.id,
        expiresAt,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { user: newUser, success: true };
    }),

  // Verify Email
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const user = await getUserByVerificationToken(input.token);
      
      if (!user) {
        throw new Error("Invalid verification token / رمز التحقق غير صحيح");
      }

      if (user.verificationTokenExpires && new Date() > new Date(user.verificationTokenExpires)) {
        throw new Error("Verification token expired / انتهت صلاحية رمز التحقق");
      }

      await upsertUser({
        ...user,
        emailVerified: 1,
        verificationToken: null,
        verificationTokenExpires: null,
      });

      return { success: true };
    }),

  // Login
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await getUserByEmail(input.email);
      
      if (!user || !user.password) {
        throw new Error("Invalid credentials / بيانات الدخول غير صحيحة");
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid credentials / بيانات الدخول غير صحيحة");
      }

      if (!user.emailVerified) {
        throw new Error("Please verify your email first / يرجى تفعيل البريد الإلكتروني أولاً");
      }

      const maxAge = (input.rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000;
      const sessionToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + maxAge);
      
      await createSession({
        id: sessionToken,
        userId: user.id,
        expiresAt,
      });
      
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge,
      });

      await upsertUser({
        ...user,
        lastSignedIn: new Date(),
      });

      return { user, success: true };
    }),

  // Forgot Password
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      if (!user) {
        // Don't reveal if user exists for security, but we'll return success
        return { success: true };
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      await upsertUser({
        ...user,
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      });

      try {
        await sendPasswordResetEmail(user.email, user.name, resetToken);
      } catch (error) {
        console.error("Failed to send reset email:", error);
      }

      return { success: true };
    }),

  // Reset Password
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      const user = await getUserByResetToken(input.token);
      
      if (!user) {
        throw new Error("Invalid or expired reset token / رمز استعادة كلمة المرور غير صحيح أو منتهي");
      }

      if (user.resetPasswordExpires && new Date() > new Date(user.resetPasswordExpires)) {
        throw new Error("Reset token expired / انتهت صلاحية رمز استعادة كلمة المرور");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await upsertUser({
        ...user,
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      return { success: true };
    }),

  // Update Profile
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      const updatedUser = await upsertUser({
        ...user,
        ...input,
      });
      return updatedUser;
    }),

  // Change Password
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.password) {
        throw new Error("User has no password set / المستخدم ليس لديه كلمة مرور مسجلة");
      }

      const passwordMatch = await bcrypt.compare(input.currentPassword, user.password);
      if (!passwordMatch) {
        throw new Error("Current password incorrect / كلمة المرور الحالية غير صحيحة");
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);
      await upsertUser({
        ...user,
        password: hashedPassword,
      });

      return { success: true };
    }),

  // Logout
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
      const parsed = require('cookie').parse(cookies);
      const sessionToken = parsed[COOKIE_NAME];
      if (sessionToken) {
        await deleteSession(sessionToken);
      }
    }
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),
});
