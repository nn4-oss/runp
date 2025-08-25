"use client";

import React from "react";

import EditorLayout from "./EditorLayout";

import { Page } from "@usefui/components";
import { Navigation } from "@/components";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EditorLayout>
      <Navigation />
      <Page.Wrapper
        $navigations={1.1}
        className="w-100 h-100 p-r-medium-30 p-b-medium-10 p-l-medium-30"
      >
        {children}
      </Page.Wrapper>
    </EditorLayout>
  );
}

export default AppLayout;
