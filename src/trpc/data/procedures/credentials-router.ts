import prisma from "@/lib/prisma";
import OpenAI from "openai";

import { symetricEncryption } from "@/security/encryption";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

type ValidationErrorType = {
  code?: number | string;
  message?: string;
  status: number;
};

export const credentialsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const credentials = await prisma.credential.findMany({
      where: { userId: ctx.user.id },
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
          userId: ctx.user.id,
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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const credential = await prisma.credential.findUnique({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!credential)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        });

      const updatedCredential = await prisma.credential.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
          userId: ctx.user.id,
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
            userId: ctx.user.id,
            name: input.name,
          },
        },
      });

      revalidatePath("/settings/api-keys");
    }),

  checkOpenAIKeyStatus: protectedProcedure
    .input(
      z.object({
        apiKey: z.string().min(1, { message: "apiKey is required" }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const apiKey = input.apiKey;
        if (!apiKey)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No API key available to check.",
          });

        const client = new OpenAI({ apiKey });

        /**  Non-billable call; Succeeds only if the key is valid */
        await client.models.list();
        return { ok: true, reason: "valid", message: "API key is valid." };
      } catch (err: unknown) {
        const error = err as ValidationErrorType & {
          error?: ValidationErrorType;
        };

        const code = error?.error?.code ?? error?.code;
        const status = error?.status;
        const message =
          error?.error?.message ?? error?.message ?? "Unknown error";

        if (code === "invalid_api_key" || status === 401)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: message ?? "Invalid API key.",
          });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
        });
      }
    }),
});
