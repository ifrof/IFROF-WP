import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export const adminActionsRouter = router({
  // User Management
  getUsers: adminProcedure
    .input(z.object({ 
      role: z.enum(["buyer", "factory", "admin"]).optional(),
      status: z.string().optional()
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      let query = db.select().from(schema.users);
      // Add filters if needed
      return await query;
    }),

  updateUserStatus: adminProcedure
    .input(z.object({ 
      userId: z.number(), 
      status: z.string() 
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.update(schema.users)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(schema.users.id, input.userId));
      return { success: true };
    }),

  bulkUpdateStatus: adminProcedure
    .input(z.object({ 
      userIds: z.array(z.number()), 
      status: z.string() 
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.update(schema.users)
        .set({ status: input.status, updatedAt: new Date() })
        .where(inArray(schema.users.id, input.userIds));
      return { success: true };
    }),

  // Factory Verification
  getPendingVerifications: adminProcedure.query(async () => {
    const db = await getDb();
    return await db.select()
      .from(schema.factoryProfiles)
      .where(eq(schema.factoryProfiles.verificationStatus, "pending"));
  }),

  approveFactory: adminProcedure
    .input(z.object({ factoryId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.update(schema.factoryProfiles)
        .set({ 
          verificationStatus: "verified", 
          verifiedAt: new Date(),
          updatedAt: new Date() 
        })
        .where(eq(schema.factoryProfiles.id, input.factoryId));
      return { success: true };
    }),
});
