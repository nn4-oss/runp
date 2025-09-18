import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";
import { consumePoints } from "@/services/usage-services";

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "projectId is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.user.id,
          },
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

  create: protectedProcedure
    .input(
      z.object({
        value: utteranceValueSchema,
        projectId: z.string().min(1, { message: "projectId is required" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const isExisting = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.user.id,
        },
      });

      if (!isExisting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      // Consume points before sending message to ensure the rate limit isn't reached
      try {
        await consumePoints();
      } catch (error) {
        // Internal error
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong.",
          });
        }

        // Rate limit response
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Message Rate Limit",
        });
      }

      const userMessage = await prisma.message.create({
        data: {
          projectId: isExisting.id,
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
          userId: ctx.user.id,
          userScope: ctx.user.scope,
        },
      });

      return userMessage;
    }),
});
