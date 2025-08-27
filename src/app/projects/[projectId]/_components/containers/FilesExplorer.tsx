"use client";

import React from "react";
import styled from "styled-components";

import { ScrollArea, Toolbar, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

type FilesProps = Record<string, string>;
type FileExplorerProps = {
  files?: FilesProps;
};

const ExplorerToolbar = styled(ScrollArea)`
  padding: var(--measurement-medium-30);
  background-color: var(--body-color);
  border-right: var(--measurement-small-30) solid var(--font-color-alpha-10);
  height: 100%;
`;

function getLanguageExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension ?? "text";
}

function FilesExplorer({ files }: FileExplorerProps) {
  return <ExplorerToolbar>files</ExplorerToolbar>;
}

export default FilesExplorer;
