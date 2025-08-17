import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "code-agent/invoke",
        data: {
          input: input.value,
        },
      });

      return { ok: true };
    }),
});

export type AppRouter = typeof appRouter;
