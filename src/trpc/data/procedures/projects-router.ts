import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";

import { generateSlug } from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
  getUnique: protectedProcedure
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

  getMany: protectedProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "asc",
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
    .mutation(async ({ input }) => {
      const userProject = await prisma.project.create({
        data: {
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
});
