import React from "react";

import { HydrateClient } from "@/trpc/server";
import { AppContainer } from "@/components";

import HomeHeading from "./_components/HomeHeading";
import HomePrompt from "./_components/HomePrompt";

async function Page() {
  return (
    <HydrateClient>
      <AppContainer className="h-100 w-100 grid align-center justify-center">
        <section className="w-100 p-medium-60">
          <HomeHeading />
          <HomePrompt />
        </section>
      </AppContainer>

      <footer className="p-medium-60  flex justify-center align-en g-medium-10">
        <p className="fs-medium-10">
          <span className="opacity-default-60">Built by</span>&nbsp;
          <a target="_blank" href="https://github.com/nnsncl">
            nnsncl
          </a>
          .
          <span className="opacity-default-60">
            &nbsp;The source code is available on&nbsp;
          </span>
          <a target="_blank" href="https://github.com/nn4-oss/runp">
            Github
          </a>
          .
        </p>
      </footer>
    </HydrateClient>
  );
}

export default Page;
