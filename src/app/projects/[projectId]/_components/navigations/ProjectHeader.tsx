"use client";

import React from "react";
import styled from "styled-components";

import {
  Badge,
  Button,
  DropdownMenu,
  Field,
  Page,
  Tooltip,
} from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "../containers/ProjectEditor";

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
`;

function ProjectsHeader({
  fragment,
  currentView,
  setSandboxKey,
  setCurrentView,
}: ProjectHeaderProps) {
  const handleViewChange = () => {
    if (currentView === "code") return setCurrentView("preview");
    if (currentView === "preview") return setCurrentView("code");
    return;
  };
  const handleRefresh = () => setSandboxKey((k) => k + 1);
  const handleNewTab = () => {
    if (!fragment?.sandboxUrl) return;
    window.open(fragment?.sandboxUrl, "_blank", "noopener,noreferrer");
  };

  const switchViewLabel = currentView === "code" ? "Preview" : "Code";

  return (
    <StyledMenu className="w-100 flex g-medium-30 align-center justify-between">
      <Field
        variant="secondary"
        sizing="small"
        className="w-100"
        style={{ width: "100%" }}
        readOnly
        disabled={!fragment?.sandboxUrl}
        value={fragment?.sandboxUrl ?? "/"}
      />

      <div className="flex g-medium-30 align-center justify-end">
        <Tooltip content={`Show ${switchViewLabel}`}>
          <Button
            disabled={!fragment?.sandboxUrl}
            variant="ghost"
            sizing="small"
            aria-label={`Show ${switchViewLabel}`}
            onClick={handleViewChange}
          >
            <Icon>
              {currentView === "code" && <PixelIcon.Eye />}
              {currentView === "preview" && <WebIcon.DataObject />}
            </Icon>
          </Button>
        </Tooltip>

        <Tooltip content="Open in new tab">
          <Button
            disabled={!fragment?.sandboxUrl}
            variant="ghost"
            sizing="small"
            aria-label="Open in new tab"
            onClick={handleNewTab}
          >
            <Icon>
              <PixelIcon.Open />
            </Icon>
          </Button>
        </Tooltip>

        <Tooltip content="Refresh page">
          <Button
            disabled={!fragment?.sandboxUrl}
            variant="ghost"
            sizing="small"
            aria-label="Refresh page"
            onClick={handleRefresh}
          >
            <Icon>
              <PixelIcon.Reload />
            </Icon>
          </Button>
        </Tooltip>
      </div>
    </StyledMenu>
  );
}

export default ProjectsHeader;
