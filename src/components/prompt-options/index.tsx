"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button, Tooltip } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";

function PromptOptions() {
  const router = useRouter();
  return (
    <div className="flex align-center g-medium-10">
      <Tooltip content="OpenAI-gpt-4.1">
        <Button animation="reflective" sizing="small" variant="secondary">
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon>
              <SocialIcon.OpenAi />
            </Icon>
          </span>
        </Button>
      </Tooltip>

      <Tooltip content="LLM Settings">
        <Button
          animation="reflective"
          sizing="small"
          variant="secondary"
          onMouseDown={() => router.push("/settings")}
        >
          <span className="p-y-small-60 flex align-center justify-center">
            <Icon fill="var(--color-green)">
              <PixelIcon.Sliders />
            </Icon>
          </span>
        </Button>
      </Tooltip>
    </div>
  );
}

export default PromptOptions;
