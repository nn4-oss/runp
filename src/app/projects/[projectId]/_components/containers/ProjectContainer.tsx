"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import ProjectsHeader from "../navigations/ProjectHeader";

import { AppContainer, Spinner } from "@/components";
import { ViewsContainer } from "./ViewsContainer";

import type { Fragment } from "generated/prisma";

function ProjectContainer({ fragment }: { fragment: Fragment | null }) {
  const [sandboxKey, setSandboxKey] = React.useState(0);

  return (
    <ViewsContainer>
      <ProjectsHeader fragment={fragment} setSandboxKey={setSandboxKey} />

      <AppContainer className="h-100 w-100 flex align-center justify-center">
        {fragment ? (
          <ProjectPreview
            sandboxUrl={fragment.sandboxUrl}
            sandboxKey={sandboxKey}
          />
        ) : (
          <Spinner />
        )}
      </AppContainer>
    </ViewsContainer>
  );
}

export default ProjectContainer;
