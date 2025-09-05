"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import AppLayout from "./AppLayout";

import { ScrollArea, Toolbar, Tooltip } from "@usefui/components";
import { AppContainer } from "@/components";
import { Icon, PixelIcon } from "@usefui/icons";

const StyledToolbar = styled(Toolbar)`
  background-color: var(--contrast-color) !important;
  min-width: fit-content !important;
`;
const LinkItem = styled(Toolbar.Item)`
  cursor: pointer;
  padding: var(--measurement-medium-30);
  border-radius: var(--measurement-medium-30);
  font-size: var(--fontsize-medium-10);

  will-change: background-color;
  transition: ease-in-out 0.2s;
  &:hover {
    background-color: var(--font-color-alpha-10);
  }
`;

const SettingsLinks = [
  {
    icon: <PixelIcon.SlidersVertical />,
    label: "General",
    path: "/settings",
  },
  {
    icon: <PixelIcon.Sliders />,
    label: "Preferences",
    path: "/settings/preferences",
  },
  {
    icon: <PixelIcon.Lock />,
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
        style={{ position: "relative" }}
      >
        <Toolbar.Root>
          <StyledToolbar side="left" sizing="small" height="auto">
            <Toolbar.Section showoncollapse className="grid g-small-30">
              {SettingsLinks.map((link) => (
                <LinkItem
                  showfirstchild
                  className="flex align-center g-medium-30"
                  key={link.label}
                  onClick={() => router.push(link.path)}
                >
                  <Icon>{link.icon}</Icon>
                  <span className="fs-medium-10">{link.label}</span>
                </LinkItem>
              ))}
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
        <ScrollArea scrollbar>{children}</ScrollArea>
      </AppContainer>
    </AppLayout>
  );
}

export default SettingsLayout;
