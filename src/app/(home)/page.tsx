import React from "react";
import { HydrateClient, caller, prefetch, trpc } from "@/trpc/server";

import LandingHeading from "./_components/LandingHeading";
import PromptField from "./_components/PromptField";
import AnimatedHero from "./_components/AnimatedHero";

async function Page() {
  // const data = await caller.create({ text: "Runp TRPC Server" });
  // console.log(data);

  // With prefetch
  prefetch(
    trpc.create.queryOptions({
      text: "Runp TRPC Client",
    }),
  );

  return (
    <HydrateClient>
      <div className="h-100 w-100" style={{ position: "relative" }}>
        <LandingHeading />
        <PromptField />
        <AnimatedHero chars="runp" />
      </div>
    </HydrateClient>
  );
}

export default Page;
