"use client";

import React from "react";
import styled from "styled-components";

import { Accordion, Button, ScrollArea } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import type { TreeItem } from "../../_utils";

type OnSelect = (path: string) => void;
type FilesTreeProps = {
  files: TreeItem[] | null;
  value: string | null;
  onSelect: OnSelect;
};
type TreeProps = {
  file: TreeItem;
  selectedValue: string;
  parentPath: string;
  onSelect: OnSelect;
};

const TreeWrapper = styled(ScrollArea)`
  padding: var(--measurement-medium-30);
  background-color: var(--contrast-color);
  border-right: var(--measurement-small-30) solid var(--font-color-alpha-10);
  height: 100%;
`;

function Tree({ file, parentPath, selectedValue, onSelect }: TreeProps) {
  const [name, ...items] = Array.isArray(file) ? file : [file];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  // File case
  if (!items.length) {
    const isFileSelected = selectedValue === currentPath;

    return (
      <Button
        onClick={() => onSelect?.(currentPath)}
        variant="ghost"
        sizing="small"
      >
        <Icon>
          <PixelIcon.File />
        </Icon>
        <span>{name}</span>
        {isFileSelected && (
          <Icon>
            <PixelIcon.ChevronRight />
          </Icon>
        )}
      </Button>
    );
  }

  // Folder case
  return (
    <Accordion.Root>
      <Accordion>
        <Accordion.Trigger value={name}>
          <Icon>
            <PixelIcon.Folder />
          </Icon>
          {name}
          <Icon>
            <PixelIcon.ChevronsVertical />
          </Icon>
        </Accordion.Trigger>
        <Accordion.Content
          value={name}
          defaultOpen
          className="p-l-medium-60 grid g-medium-30 p-t-medium-30"
        >
          {/**Recursive use of the component */}
          {items.map((subitem, key) => (
            <Tree
              key={key}
              file={subitem}
              selectedValue={selectedValue}
              onSelect={onSelect}
              parentPath={currentPath}
            />
          ))}
        </Accordion.Content>
      </Accordion>
    </Accordion.Root>
  );
}

function FilesTree({ files, value, onSelect }: FilesTreeProps) {
  return (
    <TreeWrapper scrollbar>
      {files?.map((file, key) => (
        <Tree
          key={key}
          file={file}
          selectedValue={String(value)}
          onSelect={onSelect}
          parentPath=""
        />
      ))}
    </TreeWrapper>
  );
}

export default FilesTree;
