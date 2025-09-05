import React from "react";
import { HydrateClient } from "@/trpc/server";

async function Page() {
  return <HydrateClient>Preferences</HydrateClient>;
}

export default Page;
