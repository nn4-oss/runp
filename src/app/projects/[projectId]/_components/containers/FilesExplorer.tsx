"use client";

import React from "react";
import styled from "styled-components";

import { Toolbar, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

const ExplorerToolbar = styled(Toolbar)`
  max-width: var(--measurement-large-80) !important;
  background-color: var(--contrast-color) !important;
`;

function FilesExplorer() {
  return (
    <Toolbar.Root>
      <ExplorerToolbar
        side="left"
        height="display"
        defaultOpen
        className="h-100"
      >
        <Tooltip content="Files explorer">
          <Toolbar.Trigger variant="border" sizing="small">
            <span className="flex align-center justify-center p-y-small-60">
              <Icon>
                <PixelIcon.LayoutSidebarLeft />
              </Icon>
            </span>
          </Toolbar.Trigger>
        </Tooltip>

        <Toolbar.Section className="flex justify-center w-100 h-100 align-center p-t-large-90 p-b-medium-30"></Toolbar.Section>
      </ExplorerToolbar>
    </Toolbar.Root>
  );
}

export default FilesExplorer;
