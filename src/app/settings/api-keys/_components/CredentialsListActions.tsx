"use client";

import React from "react";

import { Sheet, Tooltip } from "@usefui/components";
import { CreateCredentialDialog } from "@/components";

function CredentialsListActions() {
  return (
    <div className="flex align-center g-medium-10">
      <Sheet.Root>
        <Tooltip content="Shortcut: ctrl&nbsp;+&nbsp;a">
          <Sheet.Trigger
            variant="secondary"
            sizing="medium"
            animation="reflective"
          >
            Add New
          </Sheet.Trigger>
        </Tooltip>

        <CreateCredentialDialog />
      </Sheet.Root>
    </div>
  );
}

export default CredentialsListActions;
