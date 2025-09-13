"use client";

import React from "react";

import { Badge, Tooltip } from "@usefui/components";
import { Icon, SocialIcon } from "@usefui/icons";

function PromptOptions() {
  return (
    <div className="flex align-center g-medium-10">
      <Tooltip content="gpt-4.1">
        <Badge variant="border">
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon>
              <SocialIcon.OpenAi />
            </Icon>
          </span>
        </Badge>
      </Tooltip>
      {/* <Tooltip content="Prompt templates">
        <Badge variant="border">
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon>
              <PixelIcon.Script />
            </Icon>
          </span>
        </Badge>
      </Tooltip> */}
    </div>
  );
}

export default PromptOptions;
