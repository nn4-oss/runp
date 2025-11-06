"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SplitText, UpdateNameDialog } from "@/components";
import {
  Button,
  Dialog,
  DropdownMenu,
  Page,
  Tooltip,
} from "@usefui/components";
import { Icon } from "@usefui/icons";

import { formatDistanceToNow } from "date-fns";

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
      <div className="flex g-medium-30 align-center justify-start">
        <Dialog.Root>
          <DropdownMenu.Root>
            <DropdownMenu>
              <Tooltip content="Options">
                <DropdownMenu.Trigger
                  variant="ghost"
                  animation="reflective"
                  sizing="small"
                >
                  <Icon>
                    <Icon.ThreeDotsVertical />
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
                      <Icon.EditNarrowSquare />
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
                      <Icon.CopyDashed />
                    </Icon>
                    Copy Project ID
                  </Button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </DropdownMenu.Root>

          <UpdateNameDialog currentName={project.name} projectId={projectId} />
        </Dialog.Root>

        <div>
          <Truncate className="fs-medium-10 opacity-default-60">
            <SplitText
              stagger={0.02}
              duration={0.1}
              variant="fade"
              text={project.name}
            />
          </Truncate>
          <Truncate className="fs-small-50 opacity-default-30">
            <SplitText
              stagger={0.02}
              duration={0.1}
              delay={0.3}
              variant="fade"
              text={formatDistanceToNow(project.createdAt, {
                addSuffix: true,
              })}
            />
          </Truncate>
        </div>
      </div>
    </StyledMenu>
  );
}

export default MessagesHeader;
