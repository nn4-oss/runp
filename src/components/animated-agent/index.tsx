"use client";

import React from "react";
import { Icon, PixelIcon } from "@usefui/icons";

function AnimatedAgent() {
  const [isHandsUp, setIsHandsUp] = React.useState<boolean>(true);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setIsHandsUp((prevIsHandsUp) => !prevIsHandsUp);
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Icon aria-hidden="true" width={16} height={16} fill="var(--body-color)">
      {isHandsUp ? <PixelIcon.HumanHandsup /> : <PixelIcon.HumanHandsdown />}
    </Icon>
  );
}

export default AnimatedAgent;
