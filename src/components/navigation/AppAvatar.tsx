"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { ColorModes, SendFeedbackDialog } from "../";
import { ScrollArea, DropdownMenu, Divider, Dialog } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";

export const BrandSVG = () => {
  return (
    <path d="M412.953 445.052L345.905 511.999L316.953 483.09L323.049 355.28L412.953 445.052ZM323.049 355.28L167.62 510.478L100.573 443.53L195.049 349.194L323.049 355.28ZM156.952 321.807L67.0479 411.578L0 344.63L28.9521 315.721L156.952 321.807ZM510.477 344.63L443.429 411.577L348.953 317.242L355.049 189.433L510.477 344.63ZM163.049 193.997L156.953 321.807L1.52539 166.609L68.5732 99.6621L163.049 193.997ZM512.002 166.609L483.05 195.519L355.05 189.433L444.954 99.6611L512.002 166.609ZM412.189 68.4697L317.714 162.806L189.714 156.72L345.143 1.52246L412.189 68.4697ZM195.809 28.9102L189.714 156.72L99.8086 66.9482L166.856 0L195.809 28.9102Z" />
  );
};

function AppAvatar() {
  const router = useRouter();

  return (
    <Dialog.Root>
      <DropdownMenu.Root>
        <DropdownMenu>
          <DropdownMenu.Trigger variant="ghost" rawicon>
            <Icon
              fill="var(--font-color)"
              height={24}
              width={24}
              viewBox="0 0 512 512"
            >
              <BrandSVG />
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
