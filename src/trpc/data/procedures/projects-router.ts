import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";

import { generateSlug } from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
  getUnique: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
      }),
    )
    .query(async ({ input }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!project)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });

      return project;
    }),

  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });

    return projects;
  }),

  create: baseProcedure
    .input(
      z.object({
        value: utteranceValueSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const userProject = await prisma.project.create({
        data: {
          name: generateSlug(2, { format: "kebab" }),
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
});
