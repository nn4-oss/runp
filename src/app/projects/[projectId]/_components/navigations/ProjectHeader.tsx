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

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background-color: transparent;
`;

function ProjectsHeader() {
  return (
    <StyledMenu className="w-100 flex g-medium-30 align-center justify-between">
      <div className="flex g-medium-30 align-center">
        <DropdownMenu.Root>
          <DropdownMenu>
            <Tooltip content="View">
              <DropdownMenu.Trigger>
                <Icon>
                  <WebIcon.More />
                </Icon>
              </DropdownMenu.Trigger>
            </Tooltip>

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
      </div>

      <div className="flex g-medium-30 align-center">
        <Tooltip content="Open in new tab">
          <Button variant="ghost" sizing="small">
            <Icon>
              <PixelIcon.Open />
            </Icon>
          </Button>
        </Tooltip>

        <Field variant="secondary" sizing="small" placeholder="/" />

        <Tooltip content="Refresh page">
          <Button variant="ghost" sizing="small">
            <Icon>
              <PixelIcon.Reload />
            </Icon>
          </Button>
        </Tooltip>
      </div>

      <Tooltip content="Fullscreen">
        <Button variant="ghost">
          <Icon>
            <PixelIcon.Scale />
          </Icon>
        </Button>
      </Tooltip>
    </StyledMenu>
  );
}

export default ProjectsHeader;
