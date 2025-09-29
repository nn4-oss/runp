"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import AppLayout from "./AppLayout";

import { Button, Page, ScrollArea, Toolbar, Tooltip } from "@usefui/components";
import { AppContainer } from "@/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";

const StyledToolbar = styled(Toolbar)`
  background-color: var(--contrast-color) !important;
  min-width: fit-content !important;
`;
const PageContent = styled(Page.Content)`
  background-color: var(--contrast-color) !important;
`;

const SettingsLinks = [
  {
    icon: <PixelIcon.SlidersVertical />,
    label: "General",
    path: "/settings",
    disabled: false,
  },
  {
    icon: <PixelIcon.Lock />,
    label: "API Keys",
    path: "/settings/api-keys",
    disabled: false,
  },
  {
    icon: <PixelIcon.Zap />,
    label: "Pricing",
    path: "/settings/pricing",
    disabled: false,
  },
  {
    icon: <PixelIcon.User />,
    label: "Profile",
    path: "/settings/profile",
    disabled: false,
  },
];

function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: user, isPending } = useQuery(trpc.user.get.queryOptions());

  return (
    <AppLayout>
      <AppContainer className="h-100 w-100 flex">
        <Toolbar.Root>
          {!isPending && user?.scope && (
            <StyledToolbar side="left" sizing="small" height="auto">
              <Toolbar.Section
                showoncollapse
                className="grid g-medium-50 p-x-medium-30 p-t-medium-50"
              >
                {SettingsLinks.map((link) => {
                  const isDisabled = link.disabled;
                  const onClick = () => {
                    if (!isDisabled) router.push(link.path);
                  };

                  return (
                    <Tooltip key={link.label} content={link.label}>
                      <Button
                        sizing="small"
                        variant="ghost"
                        className="flex align-center g-medium-30"
                        disabled={isDisabled}
                        onMouseDown={onClick}
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
          )}
        </Toolbar.Root>

        <ScrollArea scrollbar>
          <PageContent scrollbar>{children}</PageContent>
        </ScrollArea>
      </AppContainer>
    </AppLayout>
  );
}

export default SettingsLayout;
