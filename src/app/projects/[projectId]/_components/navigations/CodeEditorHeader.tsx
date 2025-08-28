"use client";

import React from "react";

import { Breadcrumbs, CopyCode } from "@/components";

function CodeEditorHeader({ path, code }: { path: string; code: string }) {
  return (
    <header className="flex align-center justify-between p-medium-30 w-100 g-medium-60">
      <Breadcrumbs path={path} />
      <CopyCode value={code} />
    </header>
  );
}

export default CodeEditorHeader;
