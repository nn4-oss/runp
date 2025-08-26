"use client";

import React from "react";

import MessagesHeader from "../navigations/MessagesHeader";
import MessagesStream from "./MessagesStream";
import PromptForm from "../data/PromptForm";

import { Spinner } from "@/components";
import { Page, ScrollArea } from "@usefui/components";

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
    <Page.Content
      className="flex justify-between"
      style={{ flexDirection: "column" }}
    >
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

      <PromptForm projectId={projectId} />
    </Page.Content>
  );
}

export default MessagesContainer;
