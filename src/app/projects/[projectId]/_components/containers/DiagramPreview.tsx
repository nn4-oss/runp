"use client";

import React from "react";
import DiagramHeader from "../navigations/DiagramHeader";

import { MermaidViewer } from "@/components";
import { Page, ScrollArea } from "@usefui/components";
import { useTRPC } from "@/trpc/client";

function DiagramPreview({ code }: { code: string }) {
  const trpc = useTRPC();

  const [diagramScale, setDiagramScale] = React.useState<number>(1);

  return (
    <div className="h-100 w-100 ">
      <DiagramHeader
        code={code}
        diagramScale={diagramScale}
        setDiagramScale={setDiagramScale}
      />
      <Page.Wrapper $navigations={3.1}>
        <ScrollArea className="flex w-100 h-100" scrollbar>
          <MermaidViewer scale={diagramScale} code={code} />
        </ScrollArea>
      </Page.Wrapper>
    </div>
  );
}

export default DiagramPreview;
