import { createTRPCContext } from "@/trpc/init";

import { auth } from "@clerk/nextjs/server";
import { appRouter } from "@/trpc/routers/_app";

/**
 * Reuse TRPC router logic (tamper resistance, middleware, etc.)
 * to get user metadata instead of directly calling prisma enables to keep the guards with the same complexity.
 * This service is only required on server-side functions that requires to check user's metadata.
 */
export async function getCurrentUserViaTRPC() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  // Builds TRPC context with auth
  const ctx = await createTRPCContext();
  const caller = appRouter.createCaller(ctx);

  // Directly call userRouter.get to return user metadata
  return caller.user.get();
}
