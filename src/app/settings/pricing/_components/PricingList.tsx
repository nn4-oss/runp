"use client";

import React from "react";

import PricingHeader from "./PricingHeader";
import PricingPlans from "./PricingPlans";
import PricingFAQ from "./PricingFAQ";

function PricingList() {
  return (
    <React.Fragment>
      <PricingHeader />
      <div className="p-medium-30 grid g-medium-30 w-100">
        <PricingPlans />
        <PricingFAQ />
      </div>
    </React.Fragment>
  );
}

export default PricingList;
