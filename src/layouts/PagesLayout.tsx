"use client";

import React from "react";
import styled from "styled-components";

import { Page, ScrollArea } from "@usefui/components";
import { Navigation } from "@/components";

const AppBox = styled.div`
  margin: 0 auto;
  max-width: var(--breakpoint-desktop-small);
  min-width: var(--breakpoint-mobile-small);
`;
const AppBody = styled(Page.Content)`
  background-image: url(/vignette.webp);
  background-size: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;

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
      <AppBody className="w-100 h-100">
        <Navigation />

        <Page.Wrapper $menus={1.1}>
          <ScrollArea className="w-100 h-100" scrollbar>
            <AppBox className="p-medium-60 w-100 h-100">{children}</AppBox>
          </ScrollArea>
        </Page.Wrapper>
      </AppBody>
    </Page>
  );
}

export default PagesLayout;
