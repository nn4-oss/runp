"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DropdownMenu, Page } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { format } from "date-fns";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  padding-left: 0 !important;
  background-color: transparent;
  box-shadow: 0 0 var(--measurement-medium-50) var(--measurement-medium-10)
    var(--body-color);

  z-index: var(--depth-default-90);
`;

function MessagesHeader({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getUnique.queryOptions({ id: projectId }),
  );

  return (
    <StyledMenu className="w-100 flex g-medium-30 p-x-medium-30 align-center justify-start">
      <DropdownMenu.Root>
        <DropdownMenu>
          <DropdownMenu.Trigger variant="border" sizing="small">
            <span className="flex align-center justify-center p-y-small-60">
              <Icon>
                <PixelIcon.SlidersVertical />
              </Icon>
            </span>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.EditBox />
              </Icon>
              Rename
            </DropdownMenu.Item>

            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Duplicate />
              </Icon>
              Copy Project ID
            </DropdownMenu.Item>

            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon fill="var(--color-red)">
                <PixelIcon.Delete />
              </Icon>
              <span style={{ color: "var(--color-red)" }}>Delete</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </DropdownMenu.Root>
      <div className="grid">
        <p className="fs-medium-10">{project.name}</p>
        <span className="fs-small-60 opacity-default-30">
          Created:&nbsp;
          {format(project.createdAt, " MM/dd/yy 'at' HH:mm")}
        </span>
      </div>
    </StyledMenu>
  );
}

export default MessagesHeader;
