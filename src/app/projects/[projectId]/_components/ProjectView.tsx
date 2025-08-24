"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { AppContainer, SplitScreen, Textarea } from "@/components";

function ProjectView({ projectId }: { projectId: string }) {
  const trpc = useTRPC();

  const { data: project } = useSuspenseQuery(
    trpc.projects.getProject.queryOptions({ id: projectId }),
  );
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId }),
  );

  return (
    <SplitScreen
      defaultWidth={25}
      left={
        <AppContainer className="p-medium-60">
          <Textarea placeholder="Ask anything" />
          {JSON.stringify(messages)}
        </AppContainer>
      }
      right={
        <AppContainer className="p-medium-60">
          <p className="fs-medium-10">{JSON.stringify(project)}</p>
        </AppContainer>
      }
    />
  );
}

export default ProjectView;
