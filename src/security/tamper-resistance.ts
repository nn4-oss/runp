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

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const scopesMapping = {
  FREE: mustGetEnv("SCOPE_FREE_KEY"),
  PRO: mustGetEnv("SCOPE_PRO_KEY"),
  ENTERPRISE: mustGetEnv("SCOPE_ENTERPRISE_KEY"),
} as const satisfies Record<ScopeEnum, string>;

/**
 * Returns true if the user’s scopeKey matches the expected secret.
 */
export function tamperResistance(user: TamperUser | null | undefined): boolean {
  if (!user) return true; // no user = not tampered
  if (!user.scope || !user.scopeKey) return false;

  const expectedKey = scopesMapping[user.scope];
  if (!expectedKey) return false;

  try {
    const decryptedKey = symetricDecryption(user.scopeKey);
    return decryptedKey === expectedKey;
  } catch {
    return false;
  }
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
