import prisma from "@/lib/prisma";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

const serviceEnum = z.enum([
  "OPENAI",
  "ANTHROPIC",
  "XAI",
  "E2B",
  "SLACK",
  "DISCORD",
]);

export const integrationsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    return prisma.integration.findMany({
      where: { userId: ctx.auth.userId },
      include: {
        credential: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  link: protectedProcedure
    .input(
      z.object({
        service: serviceEnum,
        credentialId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.integration.create({
        data: {
          userId: ctx.auth.userId,
          service: input.service,
          credentialId: input.credentialId,
        },
      });
    }),

  unlink: protectedProcedure
    .input(
      z.object({
        service: serviceEnum,
        credentialId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.integration.deleteMany({
        where: {
          userId: ctx.auth.userId,
          service: input.service,
          credentialId: input.credentialId,
        },
      });
    }),

  setPrimary: protectedProcedure
    .input(
      z.object({
        service: serviceEnum,
        credentialId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.$transaction(async (tx) => {
        // Reset existing primary for this service
        await tx.integration.updateMany({
          where: {
            userId: ctx.auth.userId,
            service: input.service,
            isPrimary: true,
          },
          data: { isPrimary: false },
        });

        // Set new primary
        return tx.integration.updateMany({
          where: {
            userId: ctx.auth.userId,
            service: input.service,
            credentialId: input.credentialId,
          },
          data: { isPrimary: true },
        });
      });
    }),
});
