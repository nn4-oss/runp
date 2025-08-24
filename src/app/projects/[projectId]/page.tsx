import React from "react";

import ProjectView from "./_components/ProjectView";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

async function Page({ params }: Props) {
  const { projectId } = await params;

  prefetch(trpc.projects.getProject.queryOptions({ id: projectId }));
  prefetch(trpc.messages.getMany.queryOptions({ projectId }));

  return (
    <HydrateClient>
      <ProjectView projectId={projectId} />
    </HydrateClient>
  );
}

export default Page;
