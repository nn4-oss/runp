"use client";

import React from "react";
import mermaid from "mermaid";

import { useColorMode } from "@usefui/tokens";
import styled from "styled-components";

const DiagramContainer = styled.div<{ $scale: number }>`
  scale: ${({ $scale }) => $scale};
  transform-origin: top center;
`;

function MermaidViewer({ code, scale }: { scale: number; code: string }) {
  const { colorMode } = useColorMode();

  const [svg, setSvg] = React.useState<string>("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  /** Generate a stable unique ID per mount (avoids collisions on re-mount) */
  const diagramIdRef = React.useRef(
    `mermaid-${Math.random().toString(36).slice(2)}`,
  );

  /** Initialize/reinitialize when colorMode changes so theme applies correctly */
  React.useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: colorMode === "dark" ? "dark" : "neutral",
      securityLevel: "strict",
      fontFamily: "Inter, sans-serif",
    });

    /**
     * Reset the internal cache to avoid conflicts after hot reload/remounts.
     * no-op parse helps ensure init took effect
     */
    void mermaid.parse("");
  }, [colorMode]);

  React.useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      setSvg("");
      try {
        const container = containerRef.current ?? undefined;
        const { svg } = await mermaid.render(
          diagramIdRef.current,
          code,
          container,
        );

        if (!cancelled) setSvg(svg);
      } catch (error) {
        if (!cancelled) console.error(error, "Failed to render diagram");
      }
    };

    /** Validate early to surface syntax errors */
    try {
      void mermaid.parse(code);
    } catch (error) {
      console.error(error, "Invalid Mermaid syntax");
      return;
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };

    /** re-render on theme change so colors update */
  }, [code, colorMode]);

  return (
    <DiagramContainer
      ref={containerRef}
      id="diagram-container"
      className="w-100 h-100 flex align-start justify-center"
      $scale={scale}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}

export default MermaidViewer;
