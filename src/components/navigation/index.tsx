"use client";

import styled from "styled-components";

import { Page, Button, Tooltip } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";

import { ColorModes } from "../";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background-color: transparent;
`;

function Navigation() {
  return (
    <StyledMenu className="w-100 flex g-medium-60 p-x-medium-30 align-center justify-between">
      <Icon width={24} height={24}>
        <PixelIcon.HumanRun />
      </Icon>

      <div className="flex g-medium-60 align-center">
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
      </div>
    </StyledMenu>
  );
}

export default Navigation;
