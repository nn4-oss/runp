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
      <section style={{ position: "relative" }} className="w-100 h-100">
        <div className="h-100 w-100 flex align-center justify-center">
          <div className="w-100">
            <LandingHeading />
            <PromptField />
          </div>
        </div>
      </section>
    </HydrateClient>
  );
}

export default Page;
