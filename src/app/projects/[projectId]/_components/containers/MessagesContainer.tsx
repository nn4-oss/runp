"use client";

import React from "react";

import MessagesHeader from "../navigations/MessagesHeader";
import MessagesStream from "./MessagesStream";
import MessagesPrompt from "../data/MessagesPrompt";

import { Spinner } from "@/components";
import { ScrollArea } from "@usefui/components";
import { ViewsContainer } from "./ViewsContainer";

import type { Fragment } from "generated/prisma";

type MessageContainerProps = {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
};

function MessagesContainer({
  projectId,
  activeFragment,
  setActiveFragment,
}: MessageContainerProps) {
  return (
    <ViewsContainer>
      <React.Suspense fallback={<Spinner />}>
        <MessagesHeader projectId={projectId} />
      </React.Suspense>

      <ScrollArea scrollbar className="p-x-medium-30">
        <React.Suspense fallback={<Spinner />}>
          <MessagesStream
            projectId={projectId}
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
          />
        </React.Suspense>
      </ScrollArea>

      <MessagesPrompt projectId={projectId} />
    </ViewsContainer>
  );
}

export default MessagesContainer;
