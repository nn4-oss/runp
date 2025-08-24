"use client";

import React from "react";
import FragmentBubble from "./FragmentBubble";

import { Avatar, Field } from "@usefui/components";

import { format } from "date-fns";
import type { BubbleProps } from "../types";

function AssistantBubble({
  type,
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
}: BubbleProps) {
  return (
    <div className="grid g-medium-30">
      <div className="flex align-center g-medium-30">
        <Avatar sizing="small" src="/gradient.svg" />
        <div className="grid">
          <span className="fs-medium-10">Runp</span>
          <span className="fs-small-60 opacity-default-30">
            {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
          </span>
        </div>
      </div>

      {type === "ERROR" && <Field.Meta variant="error">{content}</Field.Meta>}

      {type === "RESULT" && (
        <div className="grid g-medium-60">
          <p className="fs-medium-20 w-80">{content}</p>
          {fragment && (
            <FragmentBubble
              fragment={fragment}
              isActiveFragment={isActiveFragment}
              onFragmentClick={onFragmentClick}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default AssistantBubble;
