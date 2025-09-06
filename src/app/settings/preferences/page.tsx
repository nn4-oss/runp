import React from "react";

import { HydrateClient } from "@/trpc/server";
import PreferencesList from "./_components/PreferencesList";

async function Page() {
  return (
    <HydrateClient>
      <PreferencesList />
    </HydrateClient>
  );
}

export default Page;
