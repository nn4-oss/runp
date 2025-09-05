import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { RateLimiterPrisma } from "rate-limiter-flexible";

const DEFAULT_POINTS = 5;
const UTTERANCE_COST = 1;
const TIME_INTERVAL = 60 * 24 * 60 * 60; // 2,592,000s = 30d
// const TIME_INTERVAL = 30 * 24 * 60 * 60; // 2,592,000s = 30d

export async function getUsageTracker() {
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: DEFAULT_POINTS,
    duration: TIME_INTERVAL,
  });

  return usageTracker;
}

export async function consumePoints() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const usageTracker = await getUsageTracker();
  const result = usageTracker.consume(userId, UTTERANCE_COST);

  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const usageTracker = await getUsageTracker();
  const result = usageTracker.get(userId);

  return result;
}
