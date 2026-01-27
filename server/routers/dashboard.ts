import { router, publicProcedure } from "../_core/trpc";

export const dashboardRouter = router({
  getStats: publicProcedure.query(async () => {
    return { stats: {} };
  }),
});
