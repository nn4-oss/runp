import React from "react";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}
import { HydrateClient } from "@/trpc/server";
import { AppContainer, SplitScreen, Textarea } from "@/components";

async function Page({ params }: Props) {
  const { projectId } = await params;

  return (
    <HydrateClient>
      <SplitScreen
        defaultWidth={25}
        left={
          <AppContainer className="p-medium-60">
            <Textarea placeholder="Ask anything" />
          </AppContainer>
        }
        right={
          <AppContainer className="p-medium-60">
            <p className="fs-medium-10">{projectId}</p>
          </AppContainer>
        }
      />
    </HydrateClient>
  );
}

export default Page;
