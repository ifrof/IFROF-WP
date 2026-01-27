import { router, publicProcedure } from "../_core/trpc";

export const ${file}Router = router({
  list: publicProcedure.query(async () => {
    return [];
  }),
});
