"use client";

import { useColorMode } from "@usefui/tokens";

import { Button, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

function ColorModes() {
  const { setColorMode } = useColorMode();

  return (
    <div className="flex align-center g-small-60">
      <Tooltip content="Light">
        <Button variant="ghost" onClick={() => setColorMode("light")}>
          <Icon>
            <PixelIcon.SunAlt />
          </Icon>
        </Button>
      </Tooltip>
      <span className="opacity-default-10 fs-medium-10 p-x-medium-10">|</span>
      <Tooltip content="Dark">
        <Button variant="ghost" onClick={() => setColorMode("dark")}>
          <Icon>
            <PixelIcon.Moon />
          </Icon>
        </Button>
      </Tooltip>
      <span className="opacity-default-10 fs-medium-10 p-x-medium-10">|</span>
      <Tooltip content="System">
        <Button variant="ghost" onClick={() => setColorMode("system")}>
          <Icon>
            <PixelIcon.Contrast />
          </Icon>
        </Button>
      </Tooltip>
    </div>
  );
}

export default ColorModes;
