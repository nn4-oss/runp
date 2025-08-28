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
  const timerRef = React.useRef<number | null>(null);

  const copyToClipboard = async () => {
    if (value == null) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Best-effort fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();

      try {
        document.execCommand("copy");
        setCopied(true);
      } finally {
        document.body.removeChild(ta);
      }
    }

    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), delay);
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Tooltip content={copied ? "Copied!" : "Copy"}>
      <Button
        variant="ghost"
        aria-label="Copy code"
        onClick={copyToClipboard}
        disabled={value == null}
      >
        <Icon>
          <PixelIcon.Clipboard />
        </Icon>
      </Button>
    </Tooltip>
  );
}

export default CopyCode;
