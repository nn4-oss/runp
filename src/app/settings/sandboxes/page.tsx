import React from "react";

import { HydrateClient } from "@/trpc/server";
import SandboxesList from "./_components/SandboxesList";

async function Page() {
  return (
    <HydrateClient>
      <SandboxesList />
    </HydrateClient>
  );
}

export default Page;
