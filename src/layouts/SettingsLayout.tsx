"use client";

import React from "react";
import styled from "styled-components";

import { usePathname, useRouter } from "next/navigation";

import AppLayout from "./AppLayout";

import { Button, ScrollArea, Toolbar, Tooltip } from "@usefui/components";
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
    icon: <PixelIcon.Trending />,
    label: "Usage",
    path: "/settings/usage",
  },
  {
    icon: <PixelIcon.Lock />,
    label: "API Keys",
    path: "/settings/api-keys",
  },
  {
    icon: <PixelIcon.LayoutHeader />,
    label: "Sandboxes",
    path: "/settings/sandboxes",
  },
] as const;

function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  console.log();
  return (
    <AppLayout>
      <AppContainer
        className="h-100 w-100 flex"
        style={{ position: "relative" }}
      >
        <Toolbar.Root>
          <StyledToolbar side="left" sizing="small" height="auto">
            <Toolbar.Section showoncollapse className="grid g-medium-10">
              {SettingsLinks.map((link) => {
                const currentPath = pathname
                  .split("/")
                  .filter(Boolean)
                  .join("/");
                const isCurrentPath = `/${currentPath}` === link.path;

                console.log({ currentPath, isCurrentPath });

                return (
                  <Tooltip key={link.label} content={link.label}>
                    <Button
                      variant={isCurrentPath ? "mono" : "border"}
                      sizing="small"
                      className="flex align-center g-medium-30"
                      onMouseDown={() => router.push(link.path)}
                    >
                      <span className="flex align-center justify-center p-y-small-60 g-medium-10">
                        <Icon>{link.icon}</Icon>
                      </span>
                    </Button>
                  </Tooltip>
                );
              })}
            </Toolbar.Section>
          </StyledToolbar>
        </Toolbar.Root>
        <ScrollArea scrollbar>{children}</ScrollArea>
      </AppContainer>
    </AppLayout>
  );
}

export default SettingsLayout;
