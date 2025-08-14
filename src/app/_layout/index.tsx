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
  background-image: url(/grain.png);
  background-size: 100px 100px;
  background-repeat: repeat;
  background-blend-mode: overlay;
  background-position: left top;
  mix-blend-mode: overlay;
`;

function AppLayout({
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

export default AppLayout;
