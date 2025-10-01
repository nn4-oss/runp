import prisma from "@/lib/prisma";

import { RateLimiterPrisma } from "rate-limiter-flexible";
import { getCurrentUserViaTRPC } from "@/security/current-user";

const MESSAGE_COST = 1;
const DAILY_LIMIT = 5;
const TIME_INTERVAL = 24 * 60 * 60; // 86,400s = 24h = 1d

/**
 * Returns a RateLimiterPrisma instance configured for ContactMessages table.
 */
export async function getUsageTracker() {
  return new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "ContactMessages",
    points: DAILY_LIMIT,
    duration: TIME_INTERVAL,
  });
}

/**
 * Consumes points for the current user.
 * Throws if unauthenticated or over limit.
 */
export async function consumeMessagesPoints() {
  const { id: userId } = await getCurrentUserViaTRPC();

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, MESSAGE_COST);

  return result;
}

/**
 * Returns the current messages usage status for the user.
 */
export async function getMessagesStatus() {
  const { id: userId } = await getCurrentUserViaTRPC();

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);

  return result;
}
