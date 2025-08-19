import { createTRPCRouter } from "../init";
import { messagesRouter } from "../data";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  // fragments: fragmentsRouter
});

export type AppRouter = typeof appRouter;
