import { createTRPCRouter } from "../init";
import {
  credentialsRouter,
  messagesRouter,
  projectsRouter,
  integrationsRouter,
  usageRouter,
  userRouter,
  configurationRouter,
} from "../data";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  credentials: credentialsRouter,
  integrations: integrationsRouter,
  usage: usageRouter,
  user: userRouter,
  configuration: configurationRouter,
});

export type AppRouter = typeof appRouter;
