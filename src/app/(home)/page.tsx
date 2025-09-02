import React from "react";

import { HydrateClient } from "@/trpc/server";
import { AppContainer } from "@/components";

import HomeHeading from "./_components/HomeHeading";
import HomePrompt from "./_components/HomePrompt";

async function Page() {
  return (
    <HydrateClient>
      <AppContainer className="h-100 w-100 flex align-center justify-center">
        <section className="w-100 p-medium-60">
          <HomeHeading />
          <HomePrompt />
        </section>
      </AppContainer>
    </HydrateClient>
  );
}

export default Page;
