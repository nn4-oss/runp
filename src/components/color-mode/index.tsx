"use client";

import { useColorMode } from "@usefui/tokens";

import { Button, Tooltip } from "@usefui/components";
import { Icon } from "@usefui/icons";

const MODES = [
  {
    key: "light",
    label: "Light",
    icon: <Icon.Sun />,
  },
  {
    key: "dark",
    label: "Dark",
    icon: <Icon.Moon />,
  },
  {
    key: "system",
    label: "System",
    icon: <Icon.ColorsBlen />,
  },
];

function ColorModes() {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <div className="flex align-center g-medium-30 p-y-small-30">
      {MODES.map((mode) => (
        <Tooltip content={mode.label} key={mode.key}>
          <Button
            variant="ghost"
            rawicon={colorMode === mode.key}
            onClick={() =>
              setColorMode(mode.key as "dark" | "light" | "system")
            }
          >
            <Icon>{mode.icon}</Icon>
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}

export default ColorModes;
