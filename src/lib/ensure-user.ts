import prisma from "@/lib/prisma";

import { currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { scopesMapping, DEFAULT_SCOPE } from "@/lib/tamper-resistance";
import { symetricEncryption } from "@/lib/encryption";

import type { ScopeEnum } from "generated/prisma";

/**
 * Ensures the user exists in both Clerk and DB.
 * - If exists in both -> returns DB user.
 * - If exists in Clerk but not DB -> creates DB user.
 * - If exists in DB but not Clerk -> throws.
 * - If exists in neither -> throws.
 */

export async function ensureUser(userId: string) {
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
    return prisma.user.create({
      data: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          null,
        imageUrl: clerkUser.imageUrl,
        scope: DEFAULT_SCOPE,
        scopeKey: symetricEncryption(scopesMapping[DEFAULT_SCOPE] as ScopeEnum),
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
