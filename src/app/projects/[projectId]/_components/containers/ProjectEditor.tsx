"use client";

import React from "react";

import MessagesContainer from "./MessagesContainer";
import ProjectContainer from "./ProjectContainer";

import { SplitScreen } from "@/components";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "../../_types";

function ProjectEditor({ projectId }: { projectId: string }) {
  const [currentView, setCurrentView] = React.useState<ViewProps>("preview");
  const [activeFragment, setActiveFragment] = React.useState<Fragment | null>(
    null,
  );

  return (
    <SplitScreen
      defaultWidth={33}
      left={
        <MessagesContainer
          projectId={projectId}
          activeFragment={activeFragment}
          setActiveFragment={setActiveFragment}
        />
      }
      right={
        <ProjectContainer
          fragment={activeFragment}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      }
    />
  );
}

export default ProjectEditor;
