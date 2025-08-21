import React from "react";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}
import { HydrateClient } from "@/trpc/server";
import { AppContainer, SplitScreen } from "@/components";

async function Page({ params }: Props) {
  const { projectId } = await params;

  return (
    <HydrateClient>
      <SplitScreen
        defaultWidth={25}
        left={
          <AppContainer className="p-medium-60">
            <p>Left</p>
          </AppContainer>
        }
        right={
          <AppContainer className="p-medium-60">
            <p>{projectId}</p>
          </AppContainer>
        }
      />
    </HydrateClient>
  );
}

export default Page;
