import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getUsageStatus } from "@/services/usage-services";

import { POINTS_PER_SCOPE } from "@/utils/scope-features";

export const usageRouter = createTRPCRouter({
  status: protectedProcedure.query(async () => {
    try {
      const result = await getUsageStatus();
      return result;
    } catch (error) {
      return null;
    }
  }),

  getMetadata: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await getUsageStatus();

      const scopePoints = POINTS_PER_SCOPE[ctx.user.scope as "FREE" | "PRO"];
      const consumedPoints = result?.consumedPoints ?? 0;
      const usageInPercent = consumedPoints / scopePoints;

      return {
        percentage: usageInPercent,
      };
    } catch (error) {
      return null;
    }
  }),
});
