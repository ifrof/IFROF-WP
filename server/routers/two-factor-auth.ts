import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb, getUsersTable } from "../db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const enable2FASchema = z.object({
  enabled: z.boolean(),
});

const verify2FASchema = z.object({
  code: z.string().length(6),
});

export const twoFactorAuthRouter = router({
  // Get 2FA status
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const usersTable = getUsersTable() as any;
    
    const [user] = await db
      .select({
        twoFactorEnabled: usersTable.twoFactorEnabled,
      })
      .from(usersTable)
      .where(eq(usersTable.id, ctx.user.id))
      .limit(1);
    
    return {
      enabled: user?.twoFactorEnabled === 1,
    };
  }),

  // Generate 2FA secret (skeleton)
  generateSecret: protectedProcedure.mutation(async ({ ctx }) => {
    // Generate a random secret for 2FA
    const secret = crypto.randomBytes(20).toString('hex');
    
    return {
      secret,
      qrCode: `otpauth://totp/IFROF:${ctx.user.email}?secret=${secret}&issuer=IFROF`,
    };
  }),

  // Enable/Disable 2FA (skeleton)
  toggle: protectedProcedure
    .input(enable2FASchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const usersTable = getUsersTable() as any;
      
      await db
        .update(usersTable)
        .set({
          twoFactorEnabled: input.enabled ? 1 : 0,
        })
        .where(eq(usersTable.id, ctx.user.id));
      
      return {
        success: true,
        enabled: input.enabled,
      };
    }),

  // Verify 2FA code (skeleton)
  verify: protectedProcedure
    .input(verify2FASchema)
    .mutation(async ({ input }) => {
      // TODO: Implement actual TOTP verification
      // For now, accept any 6-digit code as valid
      const isValid = /^\d{6}$/.test(input.code);
      
      return {
        success: isValid,
      };
    }),
});
