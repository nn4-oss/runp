import React from "react";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}
import { HydrateClient } from "@/trpc/server";

async function Page({ params }: Props) {
  const { projectId } = await params;

  return <HydrateClient>{projectId}</HydrateClient>;
}

export default Page;
