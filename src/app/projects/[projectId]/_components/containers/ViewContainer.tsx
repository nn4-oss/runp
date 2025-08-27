"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import FilesTree from "./FilesTree";

import { Spinner, SplitScreen, CodeEditor, CopyCode } from "@/components";
import { getFirstFileKey, convertFilesToTree } from "../../_utils";

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
  const files = React.useMemo(() => {
    if (fragment?.files) return fragment.files as Record<string, string>;
    return null;
  }, [fragment]);

  const filesTree = React.useMemo(() => {
    if (files) return convertFilesToTree(files);
    return null;
  }, [files]);

  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  const isPending = !fragment?.sandboxUrl;
  const isPreviewMode = !isPending && fragment && currentView === "preview";
  const isCodeMode = !isPending && fragment && currentView === "code";

  const handleOnSelectFile = React.useCallback(
    (path: string) => {
      if (files && files[path]) {
        setSelectedFile(path);
      }
    },
    [files],
  );

  /** Auto-select first file */
  React.useEffect(() => setSelectedFile(getFirstFileKey(files)), [files]);

  return (
    <div className="w-100 h-100">
      {isPending && (
        <div className="w-100 h-100 flex align-center jusity-center">
          <Spinner />
        </div>
      )}

      {isPreviewMode && (
        <ProjectPreview
          sandboxUrl={fragment.sandboxUrl}
          sandboxKey={sandboxKey}
        />
      )}

      {isCodeMode && (
        <SplitScreen
          defaultWidth={25}
          left={
            <FilesTree
              files={filesTree}
              value={selectedFile}
              onSelect={handleOnSelectFile}
            />
          }
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
