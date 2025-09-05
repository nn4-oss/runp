"use client";

import React from "react";
import styled from "styled-components";

import { Page } from "@usefui/components";
import { Navigation } from "@/components";

const NoiseBackground = styled(Page.Content)`
  background-image: url(/vignette.webp);
  background-size: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;

  background-blend-mode: overlay;
  mix-blend-mode: overlay;
`;

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Page>
      <NoiseBackground>
        <Navigation />
        <Page.Wrapper
          $navigations={1.1}
          className="w-100 h-100 p-r-medium-30 p-b-medium-10 p-l-medium-30"
        >
          {children}
        </Page.Wrapper>
      </NoiseBackground>
    </Page>
  );
}

export default AppLayout;
