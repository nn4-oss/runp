import React from "react";
import ProjectsList from "./_components/ProjectsList";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

async function Page() {
  prefetch(trpc.projects.getMany.queryOptions());

  return (
    <HydrateClient>
      <ProjectsList />
    </HydrateClient>
  );
}

export default Page;
