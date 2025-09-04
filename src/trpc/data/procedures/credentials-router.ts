import prisma from "@/lib/prisma";

import { symetricEncryption } from "@/lib/encryption";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

export const credentialsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const credentials = await prisma.credential.findMany({
      where: { userId: ctx.auth.userId },
      orderBy: { name: "asc" },
      include: {
        integrations: {
          select: {
            isPrimary: true,
            service: true,
          },
        },
      },
    });

    if (!credentials) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    }

    return credentials;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, { message: "Name is required" })
          .max(128, { message: "Name cannot exceed 128 characters" }),
        value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(256, { message: "Value cannot exceed 256 characters" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const encryptedValue = symetricEncryption(input.value);
      const newCredential = await prisma.credential.create({
        data: {
          userId: ctx.auth.userId,
          name: input.name,
          value: encryptedValue,
        },
      });

      if (!newCredential) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to add credential.",
        });
      }

      revalidatePath("/settings/api-keys");
      return newCredential;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
        name: z
          .string()
          .min(1, { message: "Name is required" })
          .max(128, { message: "Name cannot exceed 128 characters" }),
        value: z
          .string()
          .min(1, { message: "Name is required" })
          .max(256, { message: "Value cannot exceed 256 characters" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const credential = await prisma.credential.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!credential)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        });

      const encryptedValue = symetricEncryption(input.value);
      const updatedCredential = await prisma.credential.update({
        data: {
          name: input.name,
          value: encryptedValue,
        },
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!updatedCredential)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Could not update credential.",
        });

      revalidatePath("/settings/api-keys");
      return updatedCredential;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.credential.delete({
        where: {
          // Composite key https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-composite-ids-and-constraints
          userId_name: {
            userId: ctx.auth.userId,
            name: input.name,
          },
        },
      });

      revalidatePath("/settings/api-keys");
    }),
});
