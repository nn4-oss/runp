"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import PricingHeader from "./PricingHeader";
import PricingPlans from "./PricingPlans";
import PricingFAQ from "./PricingFAQ";

import { Spinner } from "@/components";

function PricingList() {
  const trpc = useTRPC();
  const { data: user, isPending } = useQuery(trpc.user.get.queryOptions());

  if (isPending) {
    return (
      <div className="w-100 h-100 flex align-center justify-center">
        <Spinner />
      </div>
    );
  }

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
