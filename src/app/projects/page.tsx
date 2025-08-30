import React from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import AppLayout from "@/layouts/AppLayout";
import ProjectsList from "./_components/ProjectsList";

async function Page() {
  prefetch(trpc.projects.getMany.queryOptions());

  return (
    <HydrateClient>
      <AppLayout>
        <ProjectsList />
      </AppLayout>
    </HydrateClient>
  );
}

export default Page;
