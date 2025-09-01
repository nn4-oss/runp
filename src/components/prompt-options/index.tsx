"use client";

import React from "react";

import { Tooltip } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";
import { ReflectiveButton } from "@/components";

function PromptOptions() {
  return (
    <div className="flex align-center g-medium-10">
      <Tooltip content="gpt-4.1">
        <ReflectiveButton variant="border" sizing="small">
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon>
              <SocialIcon.OpenAi />
            </Icon>
          </span>
        </ReflectiveButton>
      </Tooltip>
      <Tooltip content="System prompt">
        <ReflectiveButton variant="border" sizing="small">
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon>
              <PixelIcon.Script />
            </Icon>
          </span>
        </ReflectiveButton>
      </Tooltip>
    </div>
  );
}

export default PromptOptions;
