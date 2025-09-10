"use client";

import React from "react";
import styled from "styled-components";

import GeneralSettings from "./GeneralSettings";

import { FixedHeader } from "@/components";
import { Button, Page } from "@usefui/components";

const MaxWidthContainer = styled.section`
  max-width: var(--breakpoint-tablet);
  margin: 0 auto;
`;

function SettingsList() {
  return (
    <Page.Content className="w-100 h-100" scrollbar>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">General Settings</p>

          <Button variant="border" sizing="medium">
            Reset default
          </Button>
        </div>
      </FixedHeader>

      <MaxWidthContainer className="p-x-medium-30 p-t-large-10 w-100">
        <GeneralSettings />
      </MaxWidthContainer>
    </Page.Content>
  );
}

export default SettingsList;
