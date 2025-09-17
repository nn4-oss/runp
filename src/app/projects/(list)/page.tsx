import ProjectsList from "./_components/ProjectsList";
import { HydrateClient } from "@/trpc/server";

async function Page() {
  return (
    <HydrateClient>
      <ProjectsList />
    </HydrateClient>
  );
}

export default Page;
