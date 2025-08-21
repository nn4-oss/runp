"use client";

import React from "react";
import styled from "styled-components";

import { Page } from "@usefui/components";
import { Navigation } from "@/components";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Page>
      <Page.Content className="w-100 h-100">
        <Navigation />

        <Page.Wrapper
          $navigations={1.1}
          className="w-100 h-100 p-r-medium-40 p-b-medium-10 p-l-medium-40"
        >
          {children}
        </Page.Wrapper>
      </Page.Content>
    </Page>
  );
}

export default AppLayout;
