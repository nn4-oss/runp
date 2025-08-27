"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import FilesExplorer from "./FilesExplorer";
import CodeEditor from "@/components/code-editor";

import { Spinner, SplitScreen } from "@/components";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "../types";

function ViewContainer({
  fragment,
  currentView,
  sandboxKey,
}: {
  currentView: ViewProps;
  fragment: Fragment | null;
  sandboxKey: number;
}) {
  const isPending = !fragment?.sandboxUrl;
  const isPreviewMode = !isPending && fragment && currentView === "preview";
  const isCodeMode = !isPending && fragment && currentView === "code";

  return (
    <div className="w-100 h-100">
      {isPending && <Spinner />}

      {isPreviewMode && (
        <ProjectPreview
          sandboxUrl={fragment.sandboxUrl}
          sandboxKey={sandboxKey}
        />
      )}

      {isCodeMode && (
        <SplitScreen
          defaultWidth={33}
          left={<FilesExplorer />}
          right={
            <CodeEditor
              value={JSON.stringify(fragment?.files, null, 2)}
              readOnly
            />
          }
        />
      )}
    </div>
  );
}

export default ViewContainer;
