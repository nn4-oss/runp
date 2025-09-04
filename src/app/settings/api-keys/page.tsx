import React from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import CredentialsList from "./_components/CredentialsList";

async function Page() {
  prefetch(trpc.credentials.getMany.queryOptions());
  prefetch(trpc.integrations.getMany.queryOptions());

  return (
    <HydrateClient>
      <CredentialsList />
    </HydrateClient>
  );
}

export default Page;
