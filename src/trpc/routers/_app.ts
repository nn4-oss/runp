import { createTRPCRouter } from "../init";
import {
  credentialsRouter,
  messagesRouter,
  projectsRouter,
  integrationsRouter,
  usageRouter,
  userRouter,
} from "../data";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  // fragments: fragmentsRouter
  credentials: credentialsRouter,
  integrations: integrationsRouter,
  usage: usageRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
