import { router, publicProcedure } from "../_core/trpc";

export const mapsRouter = router({
  list: publicProcedure.query(async () => {
    return [];
  }),
});
