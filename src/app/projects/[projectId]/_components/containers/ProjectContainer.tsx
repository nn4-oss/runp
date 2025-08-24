"use client";

import React from "react";
import ProjectPreview from "./ProjectPreview";

import { AppContainer } from "@/components";

function ProjectContainer({ projectId }: { projectId: string }) {
  return (
    <AppContainer className="p-medium-60">
      <React.Suspense fallback="Loading project details..">
        <ProjectPreview projectId={projectId} />
      </React.Suspense>
    </AppContainer>
  );
}

export default ProjectContainer;
