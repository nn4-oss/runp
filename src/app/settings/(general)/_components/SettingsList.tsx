"use client";

import React from "react";
import GeneralSettings from "./GeneralSettings";

import { FixedHeader } from "@/components";
import { Button, Page } from "@usefui/components";

function SettingsList() {
  return (
    <Page.Content className="w-100 h-100" scrollbar>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">Application Settings</p>

          <Button variant="border" sizing="medium" disabled>
            Reset default
          </Button>
        </div>
      </FixedHeader>

      <div className="p-medium-30 w-100">
        <GeneralSettings />
      </div>
    </Page.Content>
  );
}

export default SettingsList;
