"use client";

import React from "react";

import { Breadcrumb, CopyButton } from "@usefui/components";
import { Icon } from "@usefui/icons";

function CodeEditorHeader({ path, code }: { path: string; code: string }) {
  return (
    <header className="flex align-center justify-between p-medium-30 w-100 g-medium-60">
      <Breadcrumb path={path} />

      <CopyButton value={code}>
        <Icon>
          <Icon.CopyDashed />
        </Icon>
      </CopyButton>
    </header>
  );
}

export default CodeEditorHeader;
