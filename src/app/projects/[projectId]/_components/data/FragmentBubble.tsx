"use client";

import React from "react";

import { Button } from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";

import type { FragmentBubbleProps } from "../types";

function FragmentBubble({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentBubbleProps) {
  return (
    <Button
      variant="border"
      sizing="large"
      className="w-100"
      onClick={() => onFragmentClick(fragment)}
    >
      <div className="flex align-start g-medium-30">
        <Icon>
          <WebIcon.Code />
        </Icon>
        {fragment?.sandboxUrl}
      </div>

      {isActiveFragment && (
        <Icon>
          <PixelIcon.ChevronRight />
        </Icon>
      )}
    </Button>
  );
}

export default FragmentBubble;
