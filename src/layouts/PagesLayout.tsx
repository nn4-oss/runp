"use client";

import React from "react";
import styled from "styled-components";

import { Page } from "@usefui/components";
import { Navigation } from "@/components";

const AppBody = styled(Page.Content)`
  background-color: var(--body-color);
  background-image: url(/vignette.webp);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  background-blend-mode: overlay;
  mix-blend-mode: overlay;
`;

function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Page>
      <AppBody>
        <Navigation />
        <div className="p-medium-60 w-100 h-100">{children}</div>
      </AppBody>
    </Page>
  );
}

export default PagesLayout;
