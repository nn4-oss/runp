"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import ProjectsHeader from "../navigations/ProjectHeader";

import { AppContainer, Spinner } from "@/components";
import { ViewsContainer } from "./ViewsContainer";

import type { Fragment } from "generated/prisma";

function ProjectContainer({ fragment }: { fragment: Fragment | null }) {
  return (
    <ViewsContainer>
      <ProjectsHeader />

      <AppContainer className="h-100 w-100 flex align-center justify-center">
        <React.Suspense fallback={<Spinner />}>
          {fragment ? (
            <ProjectPreview sandboxUrl={fragment.sandboxUrl} />
          ) : (
            <Spinner />
          )}
        </React.Suspense>
      </AppContainer>
    </ViewsContainer>
  );
}

export default ProjectContainer;
