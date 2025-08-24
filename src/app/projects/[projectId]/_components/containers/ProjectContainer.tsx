"use client";

import React from "react";

import MessagesStream from "./MessagesStream";
import PromptForm from "./PromptForm";
import ProjectPreview from "./ProjectPreview";

import { AppContainer, Spinner, SplitScreen, Textarea } from "@/components";
import { Page, ScrollArea } from "@usefui/components";

function ProjectContainer({ projectId }: { projectId: string }) {
  return (
    <SplitScreen
      defaultWidth={33}
      left={
        <Page.Content
          className="flex justify-between g-medium-60"
          style={{ flexDirection: "column" }}
        >
          <ScrollArea scrollbar className="p-x-medium-30">
            <React.Suspense fallback={<Spinner />}>
              <MessagesStream projectId={projectId} />
            </React.Suspense>
          </ScrollArea>

          <PromptForm projectId={projectId} />
        </Page.Content>
      }
      right={
        <AppContainer className="p-medium-60">
          <React.Suspense fallback="Loading project details..">
            <ProjectPreview projectId={projectId} />
          </React.Suspense>
        </AppContainer>
      }
    />
  );
}

export default ProjectContainer;
