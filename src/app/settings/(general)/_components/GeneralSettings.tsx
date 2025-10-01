"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import UsageSettings from "./UsageSettings";
import LLMSettings from "./LLMSettings";
import PreferencesSettings from "./PreferencesSettings";

function GeneralSettings() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.get.queryOptions());

  const isFreeScope = user?.scope === "FREE";

  return (
    <section className="grid w-100 g-medium-30 ">
      <UsageSettings />
      <LLMSettings isFreeScope={isFreeScope} />
      <PreferencesSettings />
    </section>
  );
}

export default GeneralSettings;
