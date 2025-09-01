"use client";

import React from "react";
import styled from "styled-components";

import { useUser } from "@clerk/nextjs";

import { SignOutButton } from "@clerk/nextjs";
import { Avatar, Divider, DropdownMenu } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import ColorModes from "../color-mode";

const StyledAvatar = styled(Avatar)`
  width: var(--measurement-medium-70) !important;
  min-width: var(--measurement-medium-70) !important;
  height: var(--measurement-medium-70) !important;
  min-height: var(--measurement-medium-70) !important;

  img {
    opacity: 1 !important;
  }
`;

function UserAvatar() {
  const { user } = useUser();

  return (
    <DropdownMenu.Root>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <StyledAvatar src="/gradient.svg" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sizing="large">
          <div className="grid p-l-medium-30 p-t-medium-30">
            <p className="fs-medium-10 opacity-default-30">Signed in as</p>
            <span className="fs-medium-10 opacity-default-60">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
          <Divider className="m-y-medium-50" />

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

          <SignOutButton>
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Logout />
              </Icon>
              Sign Out
            </DropdownMenu.Item>
          </SignOutButton>
        </DropdownMenu.Content>
      </DropdownMenu>
    </DropdownMenu.Root>
  );
}

export default UserAvatar;
