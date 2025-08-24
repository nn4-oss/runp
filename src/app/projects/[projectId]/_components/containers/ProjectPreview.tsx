"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

function ProjectPreview({ projectId }: { projectId: string }) {
  const trpc = useTRPC();

  const { data: project } = useSuspenseQuery(
    trpc.projects.getUnique.queryOptions({ id: projectId }),
  );

  return <div>{JSON.stringify(project)}</div>;
}

export default ProjectPreview;
