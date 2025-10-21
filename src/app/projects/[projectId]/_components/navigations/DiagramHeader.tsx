"use client";

import React from "react";

import { Button, CopyButton, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import { toast } from "sonner";

interface DiagramHeaderProperties {
  code: string;
  diagramScale: number;
  setDiagramScale: React.Dispatch<React.SetStateAction<number>>;
}
function DiagramHeader({
  code,
  diagramScale,
  setDiagramScale,
}: DiagramHeaderProperties) {
  const handleExport = () => {
    try {
      const svgElement = document.querySelector("#diagram-container svg");
      if (!svgElement) {
        toast("Export failed", { description: "No diagram to export" });
        return;
      }

      /** Serialize SVG */
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      /** Build filename from first line of the diagram */
      let filename = "diagram.svg";
      const firstLine = (code || "").split("\n")[0];
      if (firstLine) {
        const cleanName = firstLine
          .replace(/[^\w\s]/gi, "")
          .trim()
          .replace(/\s+/g, "-")
          .toLowerCase();
        if (cleanName) filename = `${cleanName}.svg`;
      }

      /** Create an object URL */
      const url = URL.createObjectURL(svgBlob);

      /** Create a temporary anchor and click it to prevent Browser Trusting issue */
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      /**
       * Add the element to be in the DOM for edge cases on various browsers
       */
      document.body.appendChild(link);

      /** iOS Safari fallback: if download attribute is ignored, open in a new tab */
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) window.open(url, "_blank");
      else link.click();

      /** DOM Cleanup */
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);

      toast("Export successful", { description: `Saved as ${filename}` });
    } catch (error) {
      console.error("Export error:", error);
      toast("Export failed", { description: "Failed to export diagram" });
    }
  };

  return (
    <header className="flex align-center justify-between p-medium-30 w-100 g-medium-60">
      <div className="flex align-center g-medium-30">
        <Button
          variant="ghost"
          sizing="small"
          onClick={() => setDiagramScale(diagramScale + 0.1)}
        >
          <Icon>
            <PixelIcon.Plus />
          </Icon>
        </Button>
        <Button
          variant="ghost"
          sizing="small"
          onClick={() =>
            setDiagramScale((prev) =>
              Math.max(0.1, Number((prev - 0.1).toFixed(2))),
            )
          }
        >
          <Icon>
            <PixelIcon.Minus />
          </Icon>
        </Button>
        <Button
          variant="ghost"
          sizing="small"
          onClick={() => setDiagramScale(1)}
        >
          <Icon>
            <PixelIcon.Reload />
          </Icon>
        </Button>
      </div>
      <div className="flex align-center g-medium-30">
        <CopyButton value={code}>
          <Icon>
            <PixelIcon.Clipboard />
          </Icon>
        </CopyButton>
        <Tooltip content="Download">
          <Button variant="ghost" sizing="small" onClick={handleExport}>
            <Icon>
              <PixelIcon.Download />
            </Icon>
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}

export default DiagramHeader;
