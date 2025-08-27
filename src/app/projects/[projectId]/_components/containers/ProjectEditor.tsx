"use client";

import React from "react";

import MessagesContainer from "./MessagesContainer";
import ProjectContainer from "./ProjectContainer";

import { SplitScreen } from "@/components";
import type { Fragment } from "generated/prisma";

function ProjectEditor({ projectId }: { projectId: string }) {
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
      right={<ProjectContainer fragment={activeFragment} />}
    />
  );
}

export default ProjectEditor;
