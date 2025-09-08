import prisma from "@/lib/prisma";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";

import { symetricEncryption } from "@/security/encryption";
import { DEFAULT_SCOPE, scopesMapping } from "@/security/tamper-resistance";

import type { ScopeEnum } from "generated/prisma";

const scopeEnum = z.enum(["FREE", "PRO", "ENTERPRISE"]);

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    return ctx.user;
  }),

  create: protectedProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        name: z.string().optional(),
        imageUrl: z.string().url().optional(),
        scope: scopeEnum.default("FREE"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.user.create({
        data: {
          id: ctx.user.id, // Clerk user ID
          email: input.email,
          name: input.name,
          imageUrl: input.imageUrl,
          scope: input.scope,
          scopeKey: symetricEncryption(
            scopesMapping[DEFAULT_SCOPE] as ScopeEnum,
          ),
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        name: z.string().optional(),
        imageUrl: z.string().url().optional(),
        scope: scopeEnum.optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          email: input.email ?? user.email,
          name: input.name ?? user.name,
          imageUrl: input.imageUrl ?? user.imageUrl,
          scope: input.scope ?? user.scope,
          // scopeKey auto-injected by Prisma middleware if scope changes
        },
      });
    }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.user.delete({
      where: { id: ctx.user.id },
    });
  }),
});
