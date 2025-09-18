import prisma from "@/lib/prisma";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";

export const configurationRouter = createTRPCRouter({
  getLatestVersion: protectedProcedure.query(async ({ ctx }) => {
    const configHistory = await prisma.configuration.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: "desc" },
      take: 1,
    });

    return configHistory;
  }),

  create: protectedProcedure
    .input(
      z.object({
        diagrams: z.boolean().optional(),
        additionalPrompt: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.configuration.create({
        data: {
          userId: ctx.user.id,
          diagrams: input.diagrams,
          additionalPrompt: input.additionalPrompt ?? "",
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        diagrams: z.boolean().optional(),
        additionalPrompt: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return prisma.configuration.update({
        where: { id: input.id, userId: ctx.user.id },
        data: {
          diagrams: input.diagrams,
          additionalPrompt: input.additionalPrompt ?? "",
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.user.delete({
        where: { id: input.id },
      });
    }),
});
