import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { text } from "stream/consumers";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          email: input.text,
        },
      });

      return { ok: true };
    }),

  create: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: opts.input.text,
      };
    }),
});

export type AppRouter = typeof appRouter;
