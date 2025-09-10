import React from "react";

import { HydrateClient } from "@/trpc/server";
import UsageList from "./_components/UsageList";

async function Page() {
  return (
    <HydrateClient>
      <UsageList />
    </HydrateClient>
  );
}

export default Page;
