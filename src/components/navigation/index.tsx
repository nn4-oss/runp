"use client";

import { Page, Button, Tooltip } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";

import { ColorModes } from "../";

function Navigation() {
  return (
    <Page.Menu className="w-100 flex g-medium-60 align-center justify-end">
      <Tooltip content="Docs">
        <Button
          className="flex g-medium-30 align-center"
          variant="ghost"
          onClick={() =>
            window.open(
              "https://usefui.dev/docs/introduction",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <Icon fillOpacity={0.6}>
            <PixelIcon.BookOpen />
          </Icon>
        </Button>
      </Tooltip>
      <Tooltip content="Github">
        <Button
          className="flex g-medium-30 align-center"
          variant="ghost"
          onClick={() =>
            window.open(
              "https://github.com/foundation-ui",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <Icon viewBox="0 0 16 16">
            <SocialIcon.Github />
          </Icon>
        </Button>
      </Tooltip>

      <span className="opacity-default-10">|</span>
      <ColorModes />
    </Page.Menu>
  );
}

export default Navigation;
