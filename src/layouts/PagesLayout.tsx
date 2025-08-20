"use client";

import React from "react";
import styled from "styled-components";

import { Page } from "@usefui/components";
import { Navigation } from "@/components";

const AppBody = styled(Page.Content)`
  background-color: var(--contrast-color);
  border-radius: var(--measurement-medium-60);
`;

function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Page>
      <Page.Content className="w-100 h-100">
        <Navigation />

        <Page.Wrapper
          $menus={1.1}
          className="w-100 h-100 p-r-medium-60 p-b-medium-60 p-l-medium-60"
        >
          <AppBody className="w-100 h-100 p-medium-60">{children}</AppBody>
        </Page.Wrapper>
      </Page.Content>
    </Page>
  );
}

export default PagesLayout;
