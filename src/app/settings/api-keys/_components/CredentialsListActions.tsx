"use client";

import React from "react";

import { Dialog } from "@usefui/components";
import { CreateCredentialDialog } from "@/components";

function CredentialsListActions() {
  return (
    <div className="flex align-center g-medium-10">
      <Dialog.Root>
        <Dialog.Trigger variant="border" sizing="medium">
          New API Key
        </Dialog.Trigger>

        <CreateCredentialDialog />
      </Dialog.Root>
    </div>
  );
}

export default CredentialsListActions;
