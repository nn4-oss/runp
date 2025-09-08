import { HydrateClient } from "@/trpc/server";
import SettingsList from "./_components/SettingsList";

async function Page() {
  return (
    <HydrateClient>
      <SettingsList />
    </HydrateClient>
  );
}

export default Page;
