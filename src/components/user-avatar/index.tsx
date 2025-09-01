"use client";

import React from "react";
import styled from "styled-components";

import { useUser } from "@clerk/nextjs";

import { SignOutButton } from "@clerk/nextjs";
import { Avatar, Divider, DropdownMenu } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import ColorModes from "../color-mode";

const StyledAvatar = styled(Avatar)`
  width: var(--measurement-medium-80) !important;
  min-width: var(--measurement-medium-80) !important;
  height: var(--measurement-medium-80) !important;
  min-height: var(--measurement-medium-80) !important;

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
          <StyledAvatar src={user?.imageUrl ?? "/gradient.svg"} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sizing="medium">
          <div className="grid p-l-medium-30 p-t-medium-30">
            {user?.username && (
              <React.Fragment>
                <p className="fs-medium-20">{user?.username}</p>
                <span className="fs-medium-10 opacity-default-60">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>

                <Divider className="m-y-medium-50" />
              </React.Fragment>
            )}
          </div>

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
            Preferences
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex align-center g-medium-30">
            <span className="flex align-center justify-center">
              <Icon>
                <PixelIcon.BookOpen />
              </Icon>
            </span>
            Documentation
            <div className="flex w-100 justify-end">
              <Icon>
                <PixelIcon.Open />
              </Icon>
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex align-center g-medium-30">
            <span className="flex align-center justify-center">
              <Icon>
                <PixelIcon.HumanHandsup />
              </Icon>
            </span>
            Community
            <div className="flex w-100 justify-end">
              <Icon>
                <PixelIcon.Open />
              </Icon>
            </div>
          </DropdownMenu.Item>

          <Divider className="m-y-medium-20" />

          <DropdownMenu.Item className="flex align-center g-medium-30" radio>
            <span className="flex align-center justify-center">
              <Icon>
                <PixelIcon.Contrast />
              </Icon>
            </span>
            Theme
            <div className="flex w-100 justify-end">
              <ColorModes />
            </div>
          </DropdownMenu.Item>

          <Divider className="m-y-medium-20" />

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
