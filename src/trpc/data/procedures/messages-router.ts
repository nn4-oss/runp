import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { z } from "zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "projectId is required" }),
      }),
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          fragment: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });

      return messages;
    }),

  create: baseProcedure
    .input(
      z.object({
        value: utteranceValueSchema,
        projectId: z.string().min(1, { message: "projectId is required" }),
      }),
    )
    .mutation(async ({ input }) => {
      const userMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/invoke",
        data: {
          input: input.value,
          projectId: input.projectId,
        },
      });

      return userMessage;
    }),
});
