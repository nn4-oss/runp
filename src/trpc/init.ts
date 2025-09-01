import superjson from "superjson";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";

import { initTRPC, TRPCError } from "@trpc/server";

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

const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { auth: ctx.auth } });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);

// Types
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
