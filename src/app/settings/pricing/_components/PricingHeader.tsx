"use client";

import React from "react";

import { Button } from "@usefui/components";
import { FixedHeader, SplitText } from "@/components";

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

        <Button variant="border" sizing="medium">
          Book a demo
        </Button>
      </div>
    </FixedHeader>
  );
}

export default PricingHeader;
