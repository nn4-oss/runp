import React from "react";

import { HydrateClient } from "@/trpc/server";
import { AppContainer } from "@/components";

import HomeHeading from "./_components/HomeHeading";
import HomePrompt from "./_components/HomePrompt";

async function Page() {
  return (
    <HydrateClient>
      <AppContainer className="h-100 w-100 p-t-large-60 p-b-large-10 p-x-medium-60">
        <HomeHeading />
        <HomePrompt />
      </AppContainer>
    </HydrateClient>
  );
}

export default Page;
