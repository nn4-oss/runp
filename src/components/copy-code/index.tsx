"use client";

import React from "react";

import { Icon, PixelIcon } from "@usefui/icons";
import { Tooltip, Button } from "@usefui/components";

function CopyCode({
  value,
  delay = 1000,
}: {
  value: string | null;
  delay?: number;
}) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), delay);
    });

    clearTimeout(delay);
  };

  return (
    <Tooltip content={copied ? "Copied!" : "Copy"}>
      <Button
        variant="ghost"
        id="copy-code-trigger"
        onClick={copyToClipboard}
        disabled={typeof value === typeof null}
      >
        <Icon>
          <PixelIcon.Clipboard />
        </Icon>
      </Button>
    </Tooltip>
  );
}

export default CopyCode;
