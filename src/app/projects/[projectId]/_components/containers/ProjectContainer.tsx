"use client";

import React from "react";

import ProjectsHeader from "../navigations/ProjectHeader";
import ViewContainer from "./ViewContainer";

import { AppContainer } from "@/components";
import { ViewsContainer } from "./ViewsContainer";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "../types";

type ProjectContainerProps = {
  fragment: Fragment | null;
  currentView: ViewProps;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewProps>>;
};
function ProjectContainer({
  currentView,
  setCurrentView,
  fragment,
}: ProjectContainerProps) {
  const [sandboxKey, setSandboxKey] = React.useState(0);

  return (
    <ViewsContainer>
      <ProjectsHeader
        fragment={fragment}
        currentView={currentView}
        setSandboxKey={setSandboxKey}
        setCurrentView={setCurrentView}
      />

      <AppContainer className="h-100 w-100 flex align-center justify-center">
        <ViewContainer
          fragment={fragment}
          currentView={currentView}
          sandboxKey={sandboxKey}
        />
      </AppContainer>
    </ViewsContainer>
  );
}

export default ProjectContainer;
