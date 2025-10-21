"use client";

import React from "react";

import { useRouter } from "next/navigation";

import BrandIcon from "../brand-icon";

import { ScrollArea, DropdownMenu, Divider, Dialog } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";
import { ColorModes, SendFeedbackDialog } from "../";

function AppAvatar() {
  const router = useRouter();

  return (
    <Dialog.Root>
      <DropdownMenu.Root>
        <DropdownMenu>
          <DropdownMenu.Trigger variant="ghost" rawicon>
            <Icon fill="none" width={29.36} height={29.36} viewBox="0 0 32 48">
              <BrandIcon />
            </Icon>
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

            <Dialog.Trigger variant="ghost" className="w-100" rawicon>
              <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
                <span className="flex align-center justify-center">
                  <Icon>
                    <PixelIcon.Message />
                  </Icon>
                </span>
                Feedbacks
              </DropdownMenu.Item>
            </Dialog.Trigger>

            <DropdownMenu.Item
              className="w-100 flex align-center g-medium-30"
              onClick={() =>
                window.open(
                  "https://github.com/nn4-oss/runp",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <span className="flex align-center g-medium-30">
                <Icon viewBox="0 0 15 15">
                  <SocialIcon.Github />
                </Icon>
              </span>
              Github
              <span className="w-100 flex justify-end">
                <Icon>
                  <PixelIcon.Open />
                </Icon>
              </span>
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

      <SendFeedbackDialog />
    </Dialog.Root>
  );
}

export default AppAvatar;
