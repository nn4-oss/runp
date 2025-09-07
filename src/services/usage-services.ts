import prisma from "@/lib/prisma";

import { RateLimiterPrisma } from "rate-limiter-flexible";
import { getCurrentUserViaTRPC } from "@/security/current-user";

import { ScopeEnum } from "generated/prisma";

const UTTERANCE_COST = 1;
const TIME_INTERVAL = 60 * 24 * 60 * 60; // 2,592,000s = 30d
const FREE_SCOPE_POINTS = 10;
const PRO_SCOPE_POINTS = 200;

async function getScopePoints(scope: ScopeEnum) {
  if (scope === ScopeEnum.FREE) return FREE_SCOPE_POINTS;
  if (scope === ScopeEnum.PRO) return PRO_SCOPE_POINTS;

  return FREE_SCOPE_POINTS;
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
