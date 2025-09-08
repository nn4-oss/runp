import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getUsageStatus } from "@/services/usage-services";

import { POINTS_PER_SCOPE } from "@/utils/scope-features";
import { TRPCError } from "@trpc/server";

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

      const scope = ctx.user.scope as keyof typeof POINTS_PER_SCOPE;
      const scopePoints = POINTS_PER_SCOPE[scope];
      if (!Number.isFinite(scopePoints) || scopePoints <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown scope: ${String(scope)}`,
        });
      }

      const consumedPoints = result?.consumedPoints ?? 0;
      const usageRatio = consumedPoints / scopePoints;
      const percentage = Math.max(0, Math.min(1, usageRatio));

      return {
        percentage: percentage,
      };
    } catch (error) {
      return null;
    }
  }),
});
