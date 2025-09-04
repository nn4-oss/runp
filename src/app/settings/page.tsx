import React from "react";
import { HydrateClient } from "@/trpc/server";

async function Page() {
  return <HydrateClient>Settings</HydrateClient>;
}

export default Page;
