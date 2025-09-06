import "server-only";

import type { ScopeEnum } from "generated/prisma";
import { symetricDecryption } from "./encryption";

/**
 * Minimal shape required for tamper resistance.
 * All fields are optional to align with Prisma's loose return types.
 */
export type TamperUser = {
  id?: string | null;
  scope?: ScopeEnum | null;
  scopeKey?: string | null;
};

export const DEFAULT_SCOPE = "FREE" as const;

export const scopesMapping: Record<string, string> = {
  FREE: process.env.SCOPE_FREE_KEY!,
  PRO: process.env.SCOPE_PRO_KEY!,
  ENTERPRISE: process.env.SCOPE_ENTERPRISE_KEY!,
};

/**
 * Returns true if the user’s scopeKey matches the expected secret.
 */
export function tamperResistance(user: TamperUser | null | undefined): boolean {
  if (!user) return true; // no user = not tampered
  if (!user.scope || !user.scopeKey) return false;

  const expectedKey = scopesMapping[user.scope];
  const decryptedKey = symetricDecryption(user.scopeKey);

  return decryptedKey === expectedKey;
}

/**
 * Throws an error if tampering is detected.
 * If user is null -> skip (let caller handle "not found").
 * If user exists but scopeKey mismatch -> throw.
 */
export function assertTamperResistance(
  user: TamperUser | null | undefined,
): void {
  if (!user) return; // Allow "not found" to bubble up normally

  if (!tamperResistance(user)) {
    throw new Error(
      `Tamper detected: User ${user?.id ?? "unknown"} has invalid scopeKey for scope ${user?.scope}`,
    );
  }
}
