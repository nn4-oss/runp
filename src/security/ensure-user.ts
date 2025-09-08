import "server-only";

import prisma from "@/lib/prisma";

import { currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { scopesMapping, DEFAULT_SCOPE } from "./tamper-resistance";
import { symetricEncryption } from "./encryption";

import type { ScopeEnum } from "generated/prisma";

/**
 * Ensures the user exists in both Clerk and DB.
 * - If exists in both -> returns DB user.
 * - If exists in Clerk but not DB -> creates DB user.
 * - If exists in DB but not Clerk -> throws.
 * - If exists in neither -> throws.
 */

export async function ensureUserInDatabase(userId: string) {
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No userId in context",
    });
  }

  // Check user in Clerk
  let clerkUser;
  try {
    clerkUser = await currentUser();
  } catch {
    clerkUser = null;
  }

  // Check user in DB
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });

  // Case: Clerk + DB -> continue
  if (clerkUser && dbUser) return dbUser;

  // Case: Clerk only -> create DB user
  if (clerkUser && !dbUser) {
    // Make creation idempotent (race-safe) and prefer primary email.
    return prisma.user.upsert({
      where: { id: clerkUser.id },
      update: {},
      create: {
        id: clerkUser.id,
        email:
          clerkUser.primaryEmailAddress?.emailAddress ??
          clerkUser.emailAddresses[0]?.emailAddress ??
          null,
        name:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          null,
        imageUrl: clerkUser.imageUrl,
        scope: DEFAULT_SCOPE,
        scopeKey: symetricEncryption(scopesMapping[DEFAULT_SCOPE]),
      },
    });
  }

  // Case: DB only (Clerk missing) -> error
  if (!clerkUser && dbUser) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Tampering Resistance: User exists in DB but not in Clerk.",
    });
  }

  // Case: neither exists
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unknown user.",
  });
}
