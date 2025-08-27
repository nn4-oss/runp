"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import FilesExplorer from "./FilesExplorer";
import CodeEditor from "@/components/code-editor";

import { Spinner } from "@/components";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "./ProjectEditor";

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
    <React.Fragment>
      {isPending && <Spinner />}

      {isPreviewMode && (
        <ProjectPreview
          sandboxUrl={fragment.sandboxUrl}
          sandboxKey={sandboxKey}
        />
      )}

      {isCodeMode && (
        <div className="h-100 w-100 h-100 flex align-center justify-center">
          <FilesExplorer />
          <CodeEditor value={JSON.stringify(fragment, null, 2)} readOnly />
        </div>
      )}
    </React.Fragment>
  );
}

export default ViewContainer;
