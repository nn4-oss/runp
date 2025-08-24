"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import AssistantBubble from "../data/AssistantBubble";
import UserBubble from "../data/UserBubble";

import { MessageRole } from "generated/prisma";

function MessagesStream({ projectId }: { projectId: string }) {
  const streamEndRef = React.useRef<HTMLDivElement>(null);

  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId }),
  );

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="grid g-large-10">
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          {message.role === MessageRole.USER && (
            <UserBubble content={message.content} />
          )}
          {message.role === MessageRole.ASSISTANT && (
            <AssistantBubble
              type={message.type}
              content={message.content}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={false}
              onFragmentClick={() => {}}
            />
          )}
        </React.Fragment>
      ))}

      <div ref={streamEndRef} />
    </div>
  );
}

export default MessagesStream;
