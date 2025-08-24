"use client";

import React from "react";

import { Badge, Button } from "@usefui/components";
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
      onClick={() => onFragmentClick(fragment)}
    >
      <Icon>
        <PixelIcon.Link />
      </Icon>
      {fragment?.sandboxUrl}

      {isActiveFragment && (
        <Icon>
          <PixelIcon.ChevronRight />
        </Icon>
      )}
    </Button>
  );
}

export default FragmentBubble;
