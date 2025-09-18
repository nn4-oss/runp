"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import { ScrollArea, Avatar, DropdownMenu, Divider } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";
import ColorModes from "../color-mode";

const BrandAvatar = styled(Avatar)`
  background-color: var(--font-color) !important;
  width: var(--measurement-medium-80) !important;
  min-width: var(--measurement-medium-80) !important;
  height: var(--measurement-medium-80) !important;
  min-height: var(--measurement-medium-80) !important;

  border-radius: var(--measurement-medium-30) !important;
`;

function AppAvatar() {
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu>
        <DropdownMenu.Trigger variant="ghost" rawicon>
          <BrandAvatar sizing="small">
            <Icon fill="var(--body-color)">
              <SocialIcon.Foundation />
            </Icon>
          </BrandAvatar>
        </DropdownMenu.Trigger>

        <ScrollArea as={DropdownMenu.Content}>
          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onMouseDown={() => router.push("/")}
          >
            <Icon>
              <PixelIcon.ChevronLeft />
            </Icon>
            Homepage
          </DropdownMenu.Item>

          <Divider className="m-y-medium-10" />

          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onMouseDown={() => router.push("/docs")}
          >
            <Icon>
              <PixelIcon.BookOpen />
            </Icon>
            Documentation
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onMouseDown={() => router.push("/docs")}
          >
            <Icon viewBox="0 0 15 15">
              <SocialIcon.Github />
            </Icon>
            Github
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onMouseDown={() => router.push("/docs")}
          >
            <Icon>
              <PixelIcon.HumanHandsup />
            </Icon>
            Community
          </DropdownMenu.Item>

          <Divider className="m-y-medium-10" />

          <DropdownMenu.Item className="flex align-center g-medium-30" radio>
            <span className="flex align-center justify-center">
              <Icon>
                <PixelIcon.Contrast />
              </Icon>
            </span>
            Appearance
            <div className="flex w-100 justify-end">
              <ColorModes />
            </div>
          </DropdownMenu.Item>
        </ScrollArea>
      </DropdownMenu>
    </DropdownMenu.Root>
  );
}

export default AppAvatar;
