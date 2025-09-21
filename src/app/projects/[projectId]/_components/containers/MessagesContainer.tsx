"use client";

import React from "react";

import MessagesHeader from "../navigations/MessagesHeader";
import MessagesStream from "./MessagesStream";
import MessagesPrompt from "../data/MessagesPrompt";

import { ScrollArea } from "@usefui/components";
import { SkeletonLoader, Spinner } from "@/components";
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
      <React.Suspense fallback={<SkeletonLoader />}>
        <MessagesHeader projectId={projectId} />
      </React.Suspense>

      <ScrollArea scrollbar className="p-x-medium-30">
        <React.Suspense
          fallback={
            <div className="h-100 w-100 flex align-center justify-center">
              <Spinner />
            </div>
          }
        >
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
