import { HydrateClient } from "@/trpc/server";

import PricingList from "./_components/PricingList";

async function Page() {
  return (
    <HydrateClient>
      <PricingList />
    </HydrateClient>
  );
}

export default Page;
