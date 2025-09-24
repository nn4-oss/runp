"use client";

import React from "react";

import ProjectPreview from "./ProjectPreview";
import DiagramPreview from "./DiagramPreview";
import CodeEditorHeader from "../navigations/CodeEditorHeader";
import FilesTree from "./FilesTree";

import { Spinner, SplitScreen, CodeEditor } from "@/components";
import { getFirstFileKey, convertFilesToTree } from "../../_utils";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "../../_types";

function ViewContainer({
  fragment,
  currentView,
  sandboxKey,
}: {
  currentView: ViewProps;
  fragment: Fragment | null;
  sandboxKey: number;
}) {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  const files = React.useMemo(() => {
    if (fragment?.files) return fragment.files as Record<string, string>;
    return null;
  }, [fragment]);

  const filesTree = React.useMemo(() => {
    if (files) return convertFilesToTree(files);
    return null;
  }, [files]);

  const editorLanguage = React.useMemo(() => {
    const file = selectedFile ?? "";
    if (file.endsWith(".tsx")) return "tsx";
    if (file.endsWith(".ts")) return "ts";
    if (file.endsWith(".jsx")) return "jsx";
    return "js";
  }, [selectedFile]);

  const isPending = !fragment?.sandboxUrl;
  const isPreviewMode = !isPending && fragment && currentView === "preview";
  const isCodeMode = !isPending && fragment && currentView === "code";
  const isDiagramMode = !isPending && fragment && currentView === "diagram";
  const showRightPanel = selectedFile && files;

  const handleOnSelectFile = React.useCallback(
    (path: string) => {
      if (!files) return;
      if (files[path]) setSelectedFile(path);
    },
    [files],
  );

  /** Auto-select first file */
  React.useEffect(() => setSelectedFile(getFirstFileKey(files)), [files]);
  return (
    <div className="w-100 h-100">
      {isPending && (
        <div className="w-100 h-100 flex align-center justify-center">
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
              {showRightPanel && files[selectedFile] ? (
                <React.Fragment>
                  <CodeEditorHeader
                    path={selectedFile}
                    code={files[selectedFile]}
                  />
                  <CodeEditor
                    readOnly
                    value={files[selectedFile]}
                    language={editorLanguage}
                  />
                </React.Fragment>
              ) : (
                <div className="flex align-center justify-center h-100">
                  <hgroup style={{ textAlign: "center" }}>
                    <p className="fs-medium-20">No file selected</p>
                    <p className="fs-medium-10 opacity-default-60">
                      Select a file to view its content
                    </p>
                  </hgroup>
                </div>
              )}
            </React.Fragment>
          }
        />
      )}

      {isDiagramMode && (
        <DiagramPreview code={(files && files["diagram.mermaid"]) ?? ""} />
      )}
    </div>
  );
}

export default ViewContainer;
