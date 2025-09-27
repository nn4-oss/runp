"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { Page, Tooltip, Button, DropdownMenu, Badge } from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";
import { Spinner } from "@/components";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "../../_types";

type ProjectHeaderProps = {
  fragment: Fragment | null;
  currentView: ViewProps;
  setSandboxKey: React.Dispatch<React.SetStateAction<number>>;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewProps>>;
};

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background-color: transparent;
  padding-left: 0;
  padding-right: var(--measurement-small-10) !important;
`;
const URLBadge = styled(Badge)`
  width: 100% !important;
  min-width: 0 !important;

  padding-left: var(--measurement-medium-40) !important;
  padding-right: var(--measurement-medium-40) !important;

  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
`;

function ProjectsHeader({
  fragment,
  currentView,
  setSandboxKey,
  setCurrentView,
}: ProjectHeaderProps) {
  const trpc = useTRPC();

  const { data: user, isPending: isUserPending } = useQuery(
    trpc.user.get.queryOptions(),
  );
  const { data: config, isPending } = useQuery(
    trpc.configuration.getLatestVersion.queryOptions(),
  );

  const handleRefresh = () => setSandboxKey((k) => k + 1);
  const handleNewTab = () => {
    if (!fragment?.sandboxUrl) return;
    window.open(fragment?.sandboxUrl, "_blank", "noopener,noreferrer");
  };
  const handleViewChange = (next: ViewProps) => {
    setCurrentView(next);
  };

  const isProMode = user?.scope === "PRO";
  const hasConfig = !isPending && config?.id;
  const hasDiagramsEnabled = isProMode && Boolean(hasConfig && config.diagrams);
  const disableIframeInteractions =
    !fragment?.sandboxUrl || ["code", "diagram"].includes(currentView);

  return (
    <StyledMenu className="flex align-center justify-between g-medium-10 w-100">
      <DropdownMenu.Root>
        <DropdownMenu>
          <Tooltip content="Views">
            <DropdownMenu.Trigger
              variant="border"
              sizing="small"
              disabled={isPending || isUserPending}
            >
              <span className="flex align-center justify-center p-y-small-40">
                <Icon>
                  <WebIcon.More />
                </Icon>
              </span>
              {isPending && isUserPending && <Spinner />}
            </DropdownMenu.Trigger>
          </Tooltip>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              onClick={() => handleViewChange("preview")}
              className="flex align-center g-medium-30"
            >
              <span className="flex align-center justify-center p-y-small-30">
                <Icon>
                  <PixelIcon.Eye />
                </Icon>
              </span>
              Preview
              {currentView === "preview" && (
                <span className="justify-end w-100 flex">
                  <Icon>
                    <PixelIcon.ChevronRight />
                  </Icon>
                </span>
              )}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => handleViewChange("code")}
              className="flex align-center g-medium-30 w-100"
            >
              <span className="flex align-center justify-center p-y-small-30">
                <Icon>
                  <WebIcon.Code />
                </Icon>
              </span>
              Code
              {currentView === "code" && (
                <span className="justify-end flex w-100">
                  <Icon>
                    <PixelIcon.ChevronRight />
                  </Icon>
                </span>
              )}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => hasDiagramsEnabled && handleViewChange("diagram")}
              className="flex align-center g-medium-30"
              disabled={!hasDiagramsEnabled}
            >
              <span className="flex align-center justify-center p-y-small-30">
                <Icon>
                  <WebIcon.Decisions />
                </Icon>
              </span>
              Diagram
              <span className="justify-end w-100 flex align-center">
                {!isProMode && (
                  <Badge variant="secondary">
                    <span className="fs-small-50">PRO</span>
                  </Badge>
                )}

                {currentView === "diagram" && (
                  <Icon>
                    <PixelIcon.ChevronRight />
                  </Icon>
                )}
              </span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </DropdownMenu.Root>

      <URLBadge
        variant="border"
        // shape="round"
        className="flex align-center justify-between g-medium-30"
      >
        <Tooltip content="Refresh page">
          <Button
            disabled={disableIframeInteractions}
            variant="ghost"
            sizing="small"
            aria-label="Refresh page"
            onClick={handleRefresh}
          >
            <span className="flex align-center justify-center p-y-small-60">
              <Icon>
                <PixelIcon.Reload />
              </Icon>
            </span>
          </Button>
        </Tooltip>

        <div className="fs-medium-10 flex">{fragment?.sandboxUrl ?? "/"}</div>

        <Tooltip content="Open in new tab">
          <Button
            disabled={disableIframeInteractions}
            variant="ghost"
            sizing="small"
            aria-label="Open in new tab"
            onClick={handleNewTab}
          >
            <span className="flex align-center justify-center p-y-small-60">
              <Icon>
                <PixelIcon.Open />
              </Icon>
            </span>
          </Button>
        </Tooltip>
      </URLBadge>
    </StyledMenu>
  );
}

export default ProjectsHeader;
