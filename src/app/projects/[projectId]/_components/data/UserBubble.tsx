"use client";

import React from "react";
import styled from "styled-components";

import { useUser } from "@clerk/nextjs";

import { Avatar, Badge } from "@usefui/components";

const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 100%;

  gap: var(--measurement-medium-10);
`;
const Bubble = styled(Badge)`
  position: relative;
  max-width: var(--measurement-large-90);

  width: 100%;
  justify-self: flex-end;
  padding: var(--measurement-medium-30) var(--measurement-medium-40) !important;
  border-radius: var(--measurement-medium-60) !important;

  font-weight: 500;
  line-height: 1.1;
  word-break: keep-all;

  font-size: var(--fontsize-medium-20) !important;

  syntax: "*";
  inherits: false;
  initial-value: solid;
`;
const AvatarBubble = styled(Avatar)`
  width: var(--measurement-medium-70) !important;
  min-width: var(--measurement-medium-70) !important;
  height: var(--measurement-medium-70) !important;
  min-height: var(--measurement-medium-70) !important;
`;
const CornerSVG = styled.svg`
  display: block;

  position: absolute;
  top: calc(var(--measurement-small-30) * -1);
  right: 0px;

  transition-property: scale, fill;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.31, 0.1, 0.08, 0.96);
  transition-delay: 0ms;
  will-change: fill;
`;

function BubbleCorner() {
  return (
    <CornerSVG fill="var(--font-color)" width={16} height={16}>
      <path d="M-2.70729e-07 6.19355C8 6.19355 12 4.12903 16 6.99382e-07C16 6.70968 16 13.5 10 16L-2.70729e-07 6.19355Z" />
    </CornerSVG>
  );
}

function UserBubble({ content }: { content: string }) {
  const { user } = useUser();
  return (
    <BubbleWrapper>
      <AvatarBubble src={user?.imageUrl ?? "/gradient.svg"} />
      <Bubble variant="primary">
        {content}
        <BubbleCorner />
      </Bubble>
    </BubbleWrapper>
  );
}

export default UserBubble;
