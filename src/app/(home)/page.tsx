import React from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import LandingHeading from "./_components/LandingHeading";
import PromptField from "./_components/PromptField";
import AnimatedHero from "./_components/AnimatedHero";

async function Page() {
  // prefetch(
  //   trpc.create.queryOptions({
  //     text: "Hello world",
  //   }),
  // );

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
