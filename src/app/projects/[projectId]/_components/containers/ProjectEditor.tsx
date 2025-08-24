"use client";

import React from "react";

import MessagesContainer from "./MessagesContainer";
import ProjectContainer from "./ProjectContainer";

import { SplitScreen } from "@/components";

function ProjectEditor({ projectId }: { projectId: string }) {
  return (
    <SplitScreen
      defaultWidth={33}
      left={<MessagesContainer projectId={projectId} />}
      right={<ProjectContainer projectId={projectId} />}
    />
  );
}

export default ProjectEditor;
