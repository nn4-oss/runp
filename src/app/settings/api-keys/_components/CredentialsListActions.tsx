"use client";

import React from "react";

import { Sheet, Tooltip } from "@usefui/components";
import { CreateCredentialDialog } from "@/components";
import { Icon, PixelIcon } from "@usefui/icons";

function CredentialsListActions() {
  return (
    <div className="flex align-center g-medium-10">
      <Sheet.Root>
        <Tooltip content="&#8963;&nbsp;+&nbsp;A">
          <Sheet.Trigger variant="border" sizing="medium">
            <Icon>
              <PixelIcon.Plus />
            </Icon>
            New API Key
          </Sheet.Trigger>
        </Tooltip>

        <CreateCredentialDialog />
      </Sheet.Root>
    </div>
  );
}

export default CredentialsListActions;
