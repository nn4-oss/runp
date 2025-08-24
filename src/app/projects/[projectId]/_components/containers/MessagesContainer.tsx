"use client";

import React from "react";

import MessagesStream from "./MessagesStream";
import PromptForm from "../data/PromptForm";

import { Spinner } from "@/components";
import { Page, ScrollArea } from "@usefui/components";

function MessagesContainer({ projectId }: { projectId: string }) {
  return (
    <Page.Content
      className="flex justify-between"
      style={{ flexDirection: "column" }}
    >
      <ScrollArea scrollbar className="p-x-medium-30">
        <React.Suspense fallback={<Spinner />}>
          <MessagesStream projectId={projectId} />
        </React.Suspense>
      </ScrollArea>

      <PromptForm projectId={projectId} />
    </Page.Content>
  );
}

export default MessagesContainer;
