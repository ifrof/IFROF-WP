import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const servicesRouter = router({
  // Get all services
  list: publicProcedure
    .query(async () => {
      // TODO: Implement services functionality
      return [];
    }),

  // Get service by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      // TODO: Implement services functionality
      return null;
    }),

  // Create service (admin only)
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement services functionality
      return { success: true };
    }),
});
