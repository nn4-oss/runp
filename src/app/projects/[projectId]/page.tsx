import React from "react";

import ProjectEditor from "./_components/containers/ProjectEditor";
import { HydrateClient } from "@/trpc/server";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

async function Page({ params }: Props) {
  const { projectId } = await params;

  return (
    <HydrateClient>
      <ProjectEditor projectId={projectId} />
    </HydrateClient>
  );
}

export default Page;
