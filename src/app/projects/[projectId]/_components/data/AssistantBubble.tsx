"use client";

import React from "react";
import styled from "styled-components";

import FragmentBubble from "./FragmentBubble";

import { Field } from "@usefui/components";

import { format } from "date-fns";
import type { BubbleProps } from "../../_types";

const BubbleText = styled.p`
  font-weight: 500;
  line-height: 1.2;
  word-break: keep-all;

  font-size: var(--fontsize-medium-20) !important;

  max-width: calc(var(--measurement-large-90) * 1.5);
  width: 100%;

  syntax: "*";
  inherits: false;
  initial-value: solid;
`;

function AssistantBubble({
  type,
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
}: BubbleProps) {
  const sanitizedContent = content.replace(/<\/?task_summary>/g, "").trim();

  return (
    <div className="grid g-medium-30">
      <div className="grid">
        <span className="fs-medium-10">Runp</span>
        <span className="fs-small-60 opacity-default-30">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>

      {type === "ERROR" && <Field.Meta variant="error">{content}</Field.Meta>}

      {type === "RESULT" && (
        <div className="grid g-medium-60">
          <BubbleText>{sanitizedContent}</BubbleText>
          {fragment && (
            <FragmentBubble
              fragment={fragment}
              isActiveFragment={isActiveFragment}
              onFragmentClick={onFragmentClick}
            />
          )}
        </div>
      )}

      <div className=""></div>
    </div>
  );
}

export default AssistantBubble;
