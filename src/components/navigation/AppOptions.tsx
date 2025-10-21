"use client";

import React from "react";

import {
  ScrollArea,
  DropdownMenu,
  Divider,
  Dialog,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon, SocialIcon, WebIcon } from "@usefui/icons";
import { ColorModes, SendFeedbackDialog } from "../";

function AppOptions() {
  return (
    <Dialog.Root>
      <DropdownMenu.Root>
        <DropdownMenu>
          <Tooltip content="Options">
            <DropdownMenu.Trigger
              variant="secondary"
              sizing="small"
              animation="reflective"
            >
              <span className="flex align-center justify-center p-y-small-60">
                <Icon>
                  <WebIcon.Settings />
                </Icon>
              </span>
            </DropdownMenu.Trigger>
          </Tooltip>

          <ScrollArea as={DropdownMenu.Content}>
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

export default AppOptions;
