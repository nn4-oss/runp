"use client";

import React from "react";

import { Dialog } from "@usefui/components";
import { FixedHeader, SendMessageDialog, SplitText } from "@/components";

function PricingHeader() {
  return (
    <FixedHeader className="grid">
      <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
        <p className="fs-medium-20">
          <SplitText
            stagger={0.02}
            duration={0.1}
            variant="fade"
            text="Pricing"
          />
        </p>

        <Dialog.Root>
          <Dialog.Trigger
            animation="reflective"
            variant="border"
            sizing="medium"
          >
            Book a demo
          </Dialog.Trigger>
          <SendMessageDialog />
        </Dialog.Root>
      </div>
    </FixedHeader>
  );
}

export default PricingHeader;
