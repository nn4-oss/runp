"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DeleteProjectDialog, UpdateNameDialog } from "@/components";
import {
  Button,
  Dialog,
  DropdownMenu,
  Page,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  padding-left: 0 !important;
  background-color: transparent;
  box-shadow: 0 0 var(--measurement-medium-50) var(--measurement-medium-10)
    var(--body-color);

  z-index: var(--depth-default-90);
`;
const Truncate = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
`;

function MessagesHeader({ projectId }: { projectId: string }) {
  const trpc = useTRPC();

  const { data: project } = useSuspenseQuery(
    trpc.projects.getUnique.queryOptions({ id: projectId }),
  );

  return (
    <StyledMenu className="w-100 flex g-medium-30 p-x-medium-30 align-center justify-between">
      <div className="w-100 flex g-medium-10 align-center justify-start">
        <Dialog.Root>
          <DropdownMenu.Root>
            <DropdownMenu>
              <Tooltip content="Options">
                <DropdownMenu.Trigger variant="border" sizing="small">
                  <Icon>
                    <PixelIcon.EditBox />
                  </Icon>
                </DropdownMenu.Trigger>
              </Tooltip>

              <DropdownMenu.Content>
                <DropdownMenu.Item
                  className="w-100 flex align-center g-medium-30"
                  radio
                >
                  <Dialog.Trigger
                    rawicon
                    variant="ghost"
                    sizing="medium"
                    style={{ width: "100%", justifyContent: "start" }}
                  >
                    <Icon>
                      <PixelIcon.EditBox />
                    </Icon>
                    Rename
                  </Dialog.Trigger>
                </DropdownMenu.Item>

                <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
                  <Button
                    rawicon
                    variant="ghost"
                    sizing="medium"
                    style={{ width: "100%", justifyContent: "start" }}
                    onClick={async () => {
                      await navigator.clipboard.writeText(project.id);
                    }}
                  >
                    <Icon>
                      <PixelIcon.Duplicate />
                    </Icon>
                    Copy Project ID
                  </Button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </DropdownMenu.Root>

          <UpdateNameDialog currentName={project.name} projectId={projectId} />
        </Dialog.Root>
        <Truncate className="fs-medium-10">{project.name}</Truncate>
      </div>
      <Dialog.Root>
        <Tooltip content="Delete">
          <Dialog.Trigger variant="border" sizing="small" rawicon>
            <span className="flex align-center justify-center p-y-small-60">
              <Icon fill="var(--color-red)">
                <PixelIcon.Delete />
              </Icon>
            </span>
          </Dialog.Trigger>
        </Tooltip>

        <DeleteProjectDialog projectId={projectId} />
      </Dialog.Root>
    </StyledMenu>
  );
}

export default MessagesHeader;
