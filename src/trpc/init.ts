import superjson from "superjson";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";

import { initTRPC, TRPCError } from "@trpc/server";
import { ensureUser } from "@/security/ensure-user";

export const createTRPCContext = cache(async () => {
  /**
   * The context will use the auth() helper from Clerk to access the user's Auth object.
   * @see https://clerk.com/docs/references/nextjs/trpc
   */

  return { auth: await auth() };
});

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// TRPC Routers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// TRPC Middlewares
const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { auth: ctx.auth } });
});
const withUser = t.middleware(async ({ ctx, next }) => {
  const user = await ensureUser(ctx.auth.userId!);
  return next({
    ctx: {
      ...ctx,
      user, // attach DB user to context
    },
  });
});

// Procedures
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure
  .use(isAuthenticated)
  .use(withUser);

// Types
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
