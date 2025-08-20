import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { generateSlug } from "random-word-slugs";
import { z } from "zod";

export const projectsRouter = createTRPCRouter({
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
        value: z
          .string()
          .min(1, { message: "input.value is required" })
          .max(1024, { message: "input.value cannot exceed 1024 chars" }),
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
