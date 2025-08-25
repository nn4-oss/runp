"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button, Divider, DropdownMenu, Page } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import { formatDistanceToNow } from "date-fns";

const StyledHeader = styled.header`
  box-shadow: 0 0 var(--measurement-medium-50) var(--measurement-medium-10)
    var(--body-color);

  z-index: var(--depth-default-90);
`;

function MessagesHeader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getUnique.queryOptions({ id: projectId }),
  );

  const lastUpdate = formatDistanceToNow(project.updatedAt, {
    addSuffix: true,
  });
  console.log(lastUpdate);
  return (
    <StyledHeader className="flex align-center justify-between p-b-medium-30">
      <DropdownMenu.Root>
        <DropdownMenu>
          <DropdownMenu.Trigger className="flex align-start">
            <span className="fs-medium-10">{project.name}</span>
            <Icon>
              <PixelIcon.ChevronDown />
            </Icon>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              className="w-100 flex align-center g-medium-30"
              onClick={() => router.push("/")}
            >
              <Icon>
                <PixelIcon.ChevronLeft />
              </Icon>
              <span className="fs-medium-10">Go to dashboard</span>
            </DropdownMenu.Item>
            <Divider />

            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Sliders />
              </Icon>
              <span className="fs-medium-10">Settings</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.EditBox />
              </Icon>
              <span className="fs-medium-10">Edit project</span>
            </DropdownMenu.Item>

            <Divider />
            <DropdownMenu.Item className="w-100 flex align-center justify-between">
              <span className="flex align-center g-medium-30">
                <Icon>
                  <PixelIcon.BookOpen />
                </Icon>
                <span className="fs-medium-10">Help</span>
              </span>

              <Icon>
                <PixelIcon.ChevronRight />
              </Icon>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </DropdownMenu.Root>
    </StyledHeader>
  );
}

export default MessagesHeader;
