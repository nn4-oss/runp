import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type AutoUpdateTitleProps = {
  projectId: string;
  title: string;
};

/**
 * This function does the same thing as trpc.projects.update except for the error handling.
 * while we want to properly throw TRPC errors on common procedure, this service is used
 * by the invokeCodeAgent workflow and must not be a breaking query.
 * If it fails then the title stays the same auto generated slug.
 */

export async function autoUpdateProjectTitle({
  projectId,
  title,
}: AutoUpdateTitleProps) {
  const where = { id: projectId };
  const data = { name: title };

  const project = await prisma.project.findUnique({ where });
  if (!project) return;

  const updated = await prisma.project.update({ data, where });
  if (!updated) return;

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
}
