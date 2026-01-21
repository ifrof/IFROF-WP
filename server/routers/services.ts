import { z } from "zod";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "../_core/trpc";
import * as schema from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const servicesRouter = router({
  // Get all services
  list: publicProcedure
    .query(async ({ ctx }) => {
      const db = ctx.db;
      const services = await db.select().from(schema.services).where(eq(schema.services.active, 1)).orderBy(desc(schema.services.createdAt));
      
      // Fetch factory info for each service
      const servicesWithFactories = await Promise.all(services.map(async (service: any) => {
        const factory = await db.select().from(schema.factories).where(eq(schema.factories.id, service.factoryId)).limit(1);
        return {
          service,
          factory: factory[0] || null
        };
      }));
      
      return servicesWithFactories;
    }),

  // Get service by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db;
      const service = await db.select().from(schema.services).where(eq(schema.services.id, input.id)).limit(1);
      if (!service[0]) return null;
      
      const factory = await db.select().from(schema.factories).where(eq(schema.factories.id, service[0].factoryId)).limit(1);
      
      return {
        service: service[0],
        factory: factory[0] || null
      };
    }),

  // Create service (admin only)
  create: adminProcedure
    .input(z.object({ 
      factoryId: z.number(),
      name: z.string(), 
      description: z.string().optional(),
      category: z.string().optional(),
      basePrice: z.number(),
      imageUrls: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const result = await db.insert(schema.services).values({
        ...input,
        active: 1
      });
      return { success: true, id: result[0]?.insertId };
    }),
});
