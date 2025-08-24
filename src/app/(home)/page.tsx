import React from "react";

import { HydrateClient } from "@/trpc/server";
import { AppContainer } from "@/components";

import LandingHeading from "./_components/LandingHeading";
import PromptField from "./_components/PromptField";

async function Page() {
  return (
    <HydrateClient>
      <AppContainer className="h-100 w-100 p-t-large-60 p-b-large-10 p-x-medium-60">
        <LandingHeading />
        <PromptField />
      </AppContainer>
    </HydrateClient>
  );
}

export default Page;
