"use client";

import React from "react";
import { Page } from "@usefui/components";

function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Page>
      <Page.Content className="w-100 h-100">{children}</Page.Content>
    </Page>
  );
}

export default EditorLayout;
