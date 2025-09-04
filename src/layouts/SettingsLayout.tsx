"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import AppLayout from "./AppLayout";

import { Button, Toolbar, Tooltip } from "@usefui/components";
import { AppContainer } from "@/components";
import { Icon, PixelIcon } from "@usefui/icons";

const StyledToolbar = styled(Toolbar)`
  background-color: var(--contrast-color) !important;
`;

const SettingsLinks = [
  {
    label: "General",
    path: "/settings",
  },
  {
    label: "Preferences",
    path: "/settings/preferences",
  },
  {
    label: "API Keys",
    path: "/settings/api-keys",
  },
] as const;

function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <AppLayout>
      <AppContainer
        className="h-100 w-100 flex"
        scrollbar
        style={{ position: "relative" }}
      >
        <Toolbar.Root>
          <StyledToolbar side="left" sizing="small" height="auto">
            <Toolbar.Section>
              <hgroup className="m-b-medium-60">
                <p className="fs-medium-10 opacity-default-30">Settings</p>
              </hgroup>
              <div className="grid align-start justify-start g-medium-30">
                {SettingsLinks.map((link) => (
                  <Button
                    variant="ghost"
                    sizing="medium"
                    key={link.label}
                    onClick={() => router.push(link.path)}
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            </Toolbar.Section>
            <Toolbar.Section
              showoncollapse
              className="grid justify-end align-end"
            >
              <Tooltip content="Toggle sidebar">
                <Toolbar.Trigger variant="border" sizing="small">
                  <span className="flex align-center justify-center p-y-small-60">
                    <Icon>
                      <PixelIcon.LayoutSidebarLeft />
                    </Icon>
                  </span>
                </Toolbar.Trigger>
              </Tooltip>
            </Toolbar.Section>
          </StyledToolbar>
        </Toolbar.Root>
        {children}
      </AppContainer>
    </AppLayout>
  );
}

export default SettingsLayout;
