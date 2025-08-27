"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import FilesExplorer from "./FilesExplorer";

import { Spinner, SplitScreen, CodeEditor, CopyCode } from "@/components";

import type { Fragment } from "generated/prisma";
import type { ViewProps, FilesProps } from "../types";

function getFirstFileKey(files: FilesProps | null): string | null {
  if (!files) return null;

  const fileKeys = Object.keys(files);
  return fileKeys.length > 0 ? fileKeys[0]! : null;
}

function ViewContainer({
  fragment,
  currentView,
  sandboxKey,
}: {
  currentView: ViewProps;
  fragment: Fragment | null;
  sandboxKey: number;
}) {
  const files = React.useMemo(() => {
    if (fragment?.files) return fragment.files as Record<string, string>;
    return null;
  }, [fragment]);

  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  const isPending = !fragment?.sandboxUrl;
  const isPreviewMode = !isPending && fragment && currentView === "preview";
  const isCodeMode = !isPending && fragment && currentView === "code";

  /** Auto-select first file */
  React.useEffect(() => {
    setSelectedFile(getFirstFileKey(files));
  }, [files]);

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
            <React.Fragment>
              {selectedFile && files && files[selectedFile] ? (
                <React.Fragment>
                  <div className="flex align-center justify-end p-medium-30">
                    <CopyCode value={files[selectedFile]} />
                  </div>
                  <CodeEditor value={files[selectedFile]} readOnly />
                </React.Fragment>
              ) : (
                <div className="flex align-center justify-center h-100">
                  <hgroup style={{ textAlign: "center" }}>
                    <p className="fs-medium-20">No file selected</p>
                    <p className="fs-medium-10 opacity-default-60">
                      Select a file to view it's content
                    </p>
                  </hgroup>
                </div>
              )}
            </React.Fragment>
          }
        />
      )}
    </div>
  );
}

export default ViewContainer;
