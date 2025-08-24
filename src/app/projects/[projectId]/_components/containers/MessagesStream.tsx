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
      {messages.map((msg, key) => (
        <React.Fragment key={key}>
          {msg.role === MessageRole.USER && (
            <UserBubble content={msg.content} />
          )}
          {msg.role === MessageRole.ASSISTANT && (
            <AssistantBubble
              type={msg.type}
              content={msg.content}
              fragment={msg.fragment}
              createdAt={msg.createdAt}
              isActiveFragment={false}
              onFragmentClick={() => console.log()}
            />
          )}
        </React.Fragment>
      ))}

      <div ref={streamEndRef} />
    </div>
  );
}

export default MessagesStream;
