"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import ProjectsHeader from "../navigations/ProjectHeader";

import { AppContainer } from "@/components";
import { Page } from "@usefui/components";

function ProjectContainer({ projectId }: { projectId: string }) {
  return (
    <Page.Content
      className="flex justify-between"
      style={{ flexDirection: "column" }}
    >
      <ProjectsHeader />

      <AppContainer className="p-medium-60">
        <React.Suspense fallback="Loading project details..">
          <ProjectPreview projectId={projectId} />
        </React.Suspense>
      </AppContainer>
    </Page.Content>
  );
}

export default ProjectContainer;
