import React from "react";

import { HydrateClient } from "@/trpc/server";
import { AppContainer } from "@/components";

import HomeHeading from "./_components/HomeHeading";
import HomePrompt from "./_components/HomePrompt";
import HomeFooter from "./_components/HomeFooter";

async function Page() {
  return (
    <HydrateClient>
      <AppContainer className="h-100 w-100 grid align-center justify-center">
        <section className="w-100 p-medium-60">
          <HomeHeading />
          <HomePrompt />
        </section>
      </AppContainer>

      <HomeFooter />
    </HydrateClient>
  );
}

export default Page;
