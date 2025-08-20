import { createTRPCRouter } from "../init";
import { messagesRouter, projectsRouter } from "../data";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  // fragments: fragmentsRouter
});

export type AppRouter = typeof appRouter;
