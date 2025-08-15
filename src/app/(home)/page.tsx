import React from "react";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";

import LandingHeading from "./_components/LandingHeading";
import PromptField from "./_components/PromptField";
import AnimatedHero from "./_components/AnimatedHero";

async function Page() {
  const data = await caller.create({ text: "Runp Server" });

  console.log(data);
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
