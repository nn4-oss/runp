"use client";

import React from "react";
import { Dialog } from "@usefui/components";
import { UpgradeScopeDialog } from "@/components";

function SubscribeActions() {
  return (
    <div className="flex align-center g-medium-10">
      <Dialog.Root>
        <Dialog.Trigger variant="primary" sizing="medium">
          Update plan
        </Dialog.Trigger>

        <UpgradeScopeDialog />
      </Dialog.Root>
    </div>
  );
}

export default SubscribeActions;
