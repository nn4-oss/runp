"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Avatar, Divider, DropdownMenu, Page } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import { formatDistanceToNow } from "date-fns";
import { ColorModes } from "@/components";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background-color: transparent;
  box-shadow: 0 0 var(--measurement-medium-50) var(--measurement-medium-10)
    var(--body-color);

  z-index: var(--depth-default-90);
`;
const UserAvatar = styled(Avatar)`
  width: var(--measurement-medium-70) !important;
  min-width: var(--measurement-medium-70) !important;
  height: var(--measurement-medium-70) !important;
  min-height: var(--measurement-medium-70) !important;
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
    <StyledMenu className="w-100 flex g-medium-30 p-x-medium-30 align-center justify-start">
      <DropdownMenu.Root>
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <UserAvatar src="/gradient.svg" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content sizing="large">
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.User />
              </Icon>
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Sliders />
              </Icon>
              Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.BookOpen />
              </Icon>
              Documentation
            </DropdownMenu.Item>

            <Divider className="m-y-medium-50" />
            <div className="flex justify-between align-center p-l-medium-30">
              <span className="opacity-default-60">Appearance</span>

              <ColorModes />
            </div>
            <Divider className="m-y-medium-50" />

            <DropdownMenu.Item
              className="w-100 flex align-center g-medium-30"
              onClick={() => router.push("/")}
            >
              <Icon>
                <PixelIcon.ChevronLeft />
              </Icon>
              Go to dashboard
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </DropdownMenu.Root>

      <span className="fs-medium-10 opacity-default-10">/</span>
      <DropdownMenu.Root>
        <DropdownMenu>
          <DropdownMenu.Trigger>
            {project.name}
            <Icon>
              <PixelIcon.ChevronDown />
            </Icon>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.EditBox />
              </Icon>
              Edit project
            </DropdownMenu.Item>

            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Bookmark />
              </Icon>
              Favorite
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
    </StyledMenu>
  );
}

export default MessagesHeader;
