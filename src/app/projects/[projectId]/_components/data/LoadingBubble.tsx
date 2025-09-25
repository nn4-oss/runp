"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

import { LiquidMetal } from "@paper-design/shaders-react";
import { Avatar } from "@usefui/components";

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
        <Avatar sizing="small">
          <LiquidMetal
            style={{ height: 100, width: 100 }}
            colorBack="hsl(0, 0%, 0%, 0)"
            colorTint="rgb(188, 220, 255)"
            repetition={4}
            softness={0.5}
            shiftRed={0.3}
            shiftBlue={0.3}
            distortion={0.1}
            contour={1}
            shape="circle"
            offsetX={0}
            offsetY={0}
            scale={1}
            rotation={50}
            speed={5}
          />
        </Avatar>
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
