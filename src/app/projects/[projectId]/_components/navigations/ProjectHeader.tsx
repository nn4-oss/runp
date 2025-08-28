"use client";

import React from "react";
import styled from "styled-components";

import { Field, Page, Tooltip } from "@usefui/components";
import { Icon, PixelIcon, WebIcon } from "@usefui/icons";
import { ReflectiveButton } from "@/components";

import type { Fragment } from "generated/prisma";
import type { ViewProps } from "../types";

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
    <StyledMenu className="w-100 flex g-medium-10 align-center justify-between">
      <Tooltip content={`Show ${switchViewLabel}`}>
        <ReflectiveButton
          disabled={!fragment?.sandboxUrl}
          variant="border"
          sizing="small"
          aria-label={`Show ${switchViewLabel}`}
          onClick={handleViewChange}
        >
          <span className="flex align-center justify-center p-y-small-60">
            <Icon>
              {currentView === "code" && <PixelIcon.Eye />}
              {currentView === "preview" && <WebIcon.DataObject />}
            </Icon>
          </span>
        </ReflectiveButton>
      </Tooltip>
      <Field
        variant="secondary"
        sizing="small"
        className="w-100"
        style={{ width: "100%" }}
        readOnly
        disabled={!fragment?.sandboxUrl}
        value={fragment?.sandboxUrl ?? "/"}
      />

      <Tooltip content="Open in new tab">
        <ReflectiveButton
          disabled={!fragment?.sandboxUrl}
          variant="border"
          sizing="small"
          aria-label="Open in new tab"
          onClick={handleNewTab}
        >
          <span className="flex align-center justify-center p-y-small-60">
            <Icon>
              <PixelIcon.Open />
            </Icon>
          </span>
        </ReflectiveButton>
      </Tooltip>

      <Tooltip content="Refresh page">
        <ReflectiveButton
          disabled={!fragment?.sandboxUrl}
          variant="border"
          sizing="small"
          aria-label="Refresh page"
          onClick={handleRefresh}
        >
          <span className="flex align-center justify-center p-y-small-60">
            <Icon>
              <PixelIcon.Reload />
            </Icon>
          </span>
        </ReflectiveButton>
      </Tooltip>
    </StyledMenu>
  );
}

export default ProjectsHeader;
