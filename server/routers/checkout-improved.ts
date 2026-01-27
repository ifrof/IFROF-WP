import { router, publicProcedure } from "../_core/trpc";

export const checkoutImprovedRouter = router({
  list: publicProcedure.query(async () => {
    return [];
  }),
});
