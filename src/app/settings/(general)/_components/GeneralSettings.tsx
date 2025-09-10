"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import UsageSettings from "./UsageSettings";
import LLMSettings from "./LLMSettings";
import PreferencesSettings from "./PreferencesSettings";

export const BorderWrapper = styled.div`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);

  background: var(--contrast-color);
`;

function GeneralSettings() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.get.queryOptions());

  const isFreeScope = user?.scope === "FREE";

  return (
    <section className="grid w-100 g-medium-30 p-b-large-10">
      <UsageSettings />
      <LLMSettings isFreeScope={isFreeScope} />
      <PreferencesSettings />
    </section>
  );
}

export default GeneralSettings;
