"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

import { Badge } from "@usefui/components";
import { AnimatedAgent } from "@/components";

const Blink = keyframes`
    from {
        opacity: var(--opacity-default-30);
    }
    to {
        opacity: var(--opacity-default-60);
    }
`;
const BlinkText = styled.span`
  animation: ${Blink} ease-in-out 1s alternate-reverse infinite;
`;

function ShimmerText() {
  const shimmerMessages = ["Loading..", "Thinking..", "Generating outputs.."];
  const [currentMsgIndex, setCurrentMsgIndex] = React.useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % shimmerMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [shimmerMessages.length]);

  return (
    <BlinkText className="fs-small-60 opacity-default-30">
      {shimmerMessages[currentMsgIndex]}
    </BlinkText>
  );
}

function LoadingBubble() {
  return (
    <div className="grid p-medium-30">
      <div className="flex align-center g-medium-30">
        <Badge
          variant="border"
          shape="round"
          className="p-y-medium-30"
          aria-hidden="true"
        >
          <span className="p-y-small-80 flex align-center justify-center">
            <AnimatedAgent />
          </span>
        </Badge>
        <div
          className="grid"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="fs-medium-10">Runp</span>
          <ShimmerText />
        </div>
      </div>
    </div>
  );
}

export default LoadingBubble;
