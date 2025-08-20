import React from "react";

import { HydrateClient } from "@/trpc/server";

import LandingHeading from "./_components/LandingHeading";
import PromptField from "./_components/PromptField";

async function Page() {
  // const data = await caller.create({ text: "Runp TRPC Server" });
  // console.log(data);

  // With prefetch
  // prefetch(
  //   trpc.create.queryOptions({
  //     text: "Runp TRPC Client",
  //   }),
  // );

  return (
    <HydrateClient>
      <section className="h-100 w-100 p-y-large-60">
        <LandingHeading />
        <PromptField />
      </section>
    </HydrateClient>
  );
}

export default Page;
