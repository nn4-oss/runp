"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Tooltip } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";
import { ReflectiveButton } from "../";

function PromptOptions() {
  const router = useRouter();
  return (
    <div className="flex align-center g-medium-10">
      <Tooltip content="OpenAI-gpt-4.1">
        <ReflectiveButton sizing="small" variant="border">
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon>
              <SocialIcon.OpenAi />
            </Icon>
          </span>
        </ReflectiveButton>
      </Tooltip>

      <Tooltip content="LLM Settings">
        <ReflectiveButton
          sizing="small"
          variant="border"
          onMouseDown={() => router.push("/settings")}
        >
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon fill="var(--color-green)">
              <PixelIcon.Sliders />
            </Icon>
          </span>
        </ReflectiveButton>
      </Tooltip>
    </div>
  );
}

export default PromptOptions;
