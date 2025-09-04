import { createTRPCRouter } from "../init";
import {
  credentialsRouter,
  messagesRouter,
  projectsRouter,
  integrationsRouter,
} from "../data";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  // fragments: fragmentsRouter
  credentials: credentialsRouter,
  integrations: integrationsRouter,
});

export type AppRouter = typeof appRouter;
