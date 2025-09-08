import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";

import { generateSlug } from "random-word-slugs";
import { revalidatePath } from "next/cache";
import { consumePoints } from "@/services/usage-services";

export const projectsRouter = createTRPCRouter({
  getUnique: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!project)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });

      return project;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        messages: true,
      },
    });

    return projects;
  }),

  create: protectedProcedure
    .input(
      z.object({
        value: utteranceValueSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
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

        // Preserve upstream TRPC error
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
          cause: error,
        });
      }

      const userProject = await prisma.project.create({
        data: {
          userId: ctx.user.id,
          name: generateSlug(2, {
            format: "kebab",
            categories: {
              noun: ["technology"],
              adjective: ["color"],
            },
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/invoke",
        data: {
          input: input.value,
          projectId: userProject.id,
        },
      });

      return userProject;
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
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!project)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });

      const updatedProject = await prisma.project.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!updatedProject)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Could not update project",
        });

      // Refresh data after the update is done
      // Prevents cache to overwrite the current data after navigating
      revalidatePath("/projects");
      revalidatePath(`/projects/${input.id}`);

      return updatedProject;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.project.delete({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      revalidatePath("/projects");
    }),
});
