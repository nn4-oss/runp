"use client";

import React from "react";
import styled from "styled-components";

import {
  Badge,
  Button,
  DropdownMenu,
  Field,
  Page,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";

import type { Fragment } from "generated/prisma";

type ProjectHeaderProps = {
  fragment: Fragment | null;
  setSandboxKey: React.Dispatch<React.SetStateAction<number>>;
};

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background-color: transparent;
  padding-left: 0;
`;

function ProjectsHeader({ fragment, setSandboxKey }: ProjectHeaderProps) {
  const handleRefresh = () => setSandboxKey(Math.random());
  const handleNewTab = () => {
    if (!fragment?.sandboxUrl) return;
    window.open(fragment?.sandboxUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <StyledMenu className="w-100 flex g-medium-30 align-center justify-between">
      <Field
        variant="secondary"
        sizing="small"
        className="w-100"
        style={{ width: "100%" }}
        disabled={!fragment?.sandboxUrl}
        value={fragment?.sandboxUrl ?? "/"}
      />

      <div className="flex g-medium-30 align-center justify-end">
        <DropdownMenu.Root>
          <DropdownMenu>
            <DropdownMenu.Trigger>
              <Icon>
                <PixelIcon.SlidersVertical />
              </Icon>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content sizing="small">
              <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
                <Icon>
                  <PixelIcon.Eye />
                </Icon>
                Preview
              </DropdownMenu.Item>
              <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
                <Icon>
                  <PixelIcon.ChevronsHorizontal />
                </Icon>
                Code
              </DropdownMenu.Item>
              <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
                <Icon>
                  <PixelIcon.CornerUpLeft />
                </Icon>
                Diagram
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </DropdownMenu.Root>
        <Tooltip content="Open in new tab">
          <Button
            disabled={!fragment}
            variant="ghost"
            sizing="small"
            aria-label="Open in new tab"
            onClick={handleNewTab}
          >
            <Icon>
              <PixelIcon.Open />
            </Icon>
          </Button>
        </Tooltip>
        <Tooltip content="Refresh page">
          <Button
            disabled={!fragment}
            variant="ghost"
            sizing="small"
            aria-label="Refresh page"
            onClick={handleRefresh}
          >
            <Icon>
              <PixelIcon.Reload />
            </Icon>
          </Button>
        </Tooltip>
      </div>
    </StyledMenu>
  );
}

export default ProjectsHeader;
