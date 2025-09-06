import React from "react";
import { HydrateClient } from "@/trpc/server";

async function Page() {
  return <HydrateClient>General</HydrateClient>;
}

export default Page;
