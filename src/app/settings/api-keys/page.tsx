import CredentialsList from "./_components/CredentialsList";
import { HydrateClient } from "@/trpc/server";

async function Page() {
  return (
    <HydrateClient>
      <CredentialsList />
    </HydrateClient>
  );
}

export default Page;
