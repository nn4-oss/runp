import prisma from "@/lib/prisma";

import { RateLimiterPrisma } from "rate-limiter-flexible";
import { getCurrentUserViaTRPC } from "@/security/current-user";

import { ScopeEnum } from "generated/prisma";
import { POINTS_PER_SCOPE } from "@/utils/scope-features";

const UTTERANCE_COST = 1;
const TIME_INTERVAL = 30 * 24 * 60 * 60; // 2,592,000s = 30d

async function getScopePoints(scope: ScopeEnum) {
  if (scope === ScopeEnum.FREE) return POINTS_PER_SCOPE.FREE;
  if (scope === ScopeEnum.PRO) return POINTS_PER_SCOPE.PRO;

  return POINTS_PER_SCOPE.FREE;
}

/**
 * Returns a RateLimiterPrisma instance configured for Usage table.
 * Ensures the current user exists in Clerk + DB before returning.
 */
export async function getUsageTracker() {
  const user = await getCurrentUserViaTRPC();
  if (!user) throw new Error("User not found");

  const scopePoints = await getScopePoints(user.scope);

  return new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: scopePoints,
    duration: TIME_INTERVAL,
  });
}

/**
 * Consumes points for the current user.
 * Throws if unauthenticated or over limit.
 */
export async function consumePoints() {
  const { id: userId } = await getCurrentUserViaTRPC();
  if (!userId) throw new Error("Unauthenticated");

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, UTTERANCE_COST);

  return result;
}

/**
 * Returns the current usage status for the user.
 */
export async function getUsageStatus() {
  const { id: userId } = await getCurrentUserViaTRPC();
  if (!userId) throw new Error("Unauthenticated");

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);

  return result;
}
