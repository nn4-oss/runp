import { PrismaClient } from "../../generated/prisma";
import {
  assertTamperResistance,
  scopesMapping,
} from "@/security/tamper-resistance";
import { symetricEncryption } from "@/security/encryption";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

/**
 * Prisma Client Extension: Tamper Resistance
 *
 * Users in the DB have two fields controlling access:
 *  - `scope`    -> enum (FREE, PRO, ENTERPRISE)
 *  - `scopeKey` -> secret value (from env) that must match the scope
 *
 * This extension enforces tamper resistance at the ORM layer:
 *
 * On **reads** (`findUnique`, `findFirst`, `findMany`):
 *  - Validates that `scopeKey` matches the expected secret for the user’s `scope`.
 *  - Throws an error if mismatch (tampering detected).
 *
 * On **writes** (`create`, `update`, `upsert`):
 *  - Automatically injects the correct `scopeKey` based on the chosen `scope`.
 *  - Validates the result after the write.
 *
 * Notes:
 *
 * Even if TRPC middleware is bypassed, Prisma itself enforces security and any DB tampering is detected immediately when reading users
 * This is a last line of defense. Combined with TRPC middleware (`ensureUserInDatabase`) and DB constraints, it provides protection for sensitive data.
 */

/**
 * Injects the correct scopeKey into the mutation payload
 * before writing to the database.
 */
function injectScopeKey(data: any, opts: { require?: boolean } = {}) {
  if (!data) return;
  // Never trust caller-provided scopeKey
  if ("scopeKey" in data) delete data.scopeKey;

  const scope = data.scope as keyof typeof scopesMapping | undefined;
  if (!scope) {
    if (opts.require) throw new Error("scope is required for user creation.");
    return;
  }
  const key = scopesMapping[scope];
  if (!key) throw new Error(`Invalid scope: ${scope}`);
  data.scopeKey = symetricEncryption(key);
}
/**
 * Prisma Client with tamper-resistance extension.
 * - Validates scope <-> scopeKey on reads.
 * - Injects scopeKey + validates on writes.
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    query: {
      user: {
        async findUnique({ args, query }) {
          const originalSelect = args?.select ? { ...args.select } : undefined;
          if (originalSelect) {
            args.select = { ...originalSelect, scope: true, scopeKey: true };
          }

          const result = await query(args);
          if (!result) return result;
          assertTamperResistance(result);

          // Strip secrets unless explicitly requested
          if (!originalSelect?.scopeKey) delete (result as any).scopeKey;
          if (originalSelect && !originalSelect.scope)
            delete (result as any).scope;

          return result;
        },

        async findFirst({ args, query }) {
          const originalSelect = args?.select ? { ...args.select } : undefined;
          if (originalSelect) {
            args.select = { ...originalSelect, scope: true, scopeKey: true };
          }

          const result = await query(args);
          if (!result) return result;
          assertTamperResistance(result);

          if (!originalSelect?.scopeKey) delete (result as any).scopeKey;
          if (originalSelect && !originalSelect.scope)
            delete (result as any).scope;

          return result;
        },

        async findMany({ args, query }) {
          const originalSelect = args?.select ? { ...args.select } : undefined;
          if (originalSelect) {
            args.select = { ...originalSelect, scope: true, scopeKey: true };
          }

          const results = await query(args);
          results.forEach(assertTamperResistance);

          // Strip secrets unless explicitly requested
          if (originalSelect) {
            for (const r of results) {
              if (!originalSelect.scopeKey) delete (r as any).scopeKey;
              if (!originalSelect.scope) delete (r as any).scope;
            }
          } else {
            for (const r of results) delete (r as any).scopeKey;
          }

          return results;
        },

        async create({ args, query }) {
          injectScopeKey(args.data);

          const originalSelect = args?.select ? { ...args.select } : undefined;
          if (originalSelect) {
            args.select = { ...originalSelect, scope: true, scopeKey: true };
          }
          const result = await query(args);
          assertTamperResistance(result);

          if (!originalSelect?.scopeKey) delete (result as any).scopeKey;
          if (originalSelect && !originalSelect.scope)
            delete (result as any).scope;

          return result;
        },

        async update({ args, query }) {
          injectScopeKey(args.data);

          const originalSelect = args?.select ? { ...args.select } : undefined;
          if (originalSelect) {
            args.select = { ...originalSelect, scope: true, scopeKey: true };
          }
          const result = await query(args);
          assertTamperResistance(result);

          if (!originalSelect?.scopeKey) delete (result as any).scopeKey;
          if (originalSelect && !originalSelect.scope)
            delete (result as any).scope;

          return result;
        },

        async upsert({ args, query }) {
          injectScopeKey(args.create, { require: true });
          injectScopeKey(args.update);

          const originalSelect = args?.select ? { ...args.select } : undefined;
          if (originalSelect) {
            args.select = { ...originalSelect, scope: true, scopeKey: true };
          }
          const result = await query(args);
          assertTamperResistance(result);

          if (!originalSelect?.scopeKey) delete (result as any).scopeKey;
          if (originalSelect && !originalSelect.scope)
            delete (result as any).scope;

          return result;
        },
      },
    },
  });

// Reuse Prisma client during dev (singleton pattern)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
