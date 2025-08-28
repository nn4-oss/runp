"use client";

import React from "react";
import styled from "styled-components";

import { Badge } from "@usefui/components";

const Bubble = styled(Badge)`
  max-width: 80%;
  width: 100%;
  justify-self: flex-end;
  padding: var(--measurement-medium-40) var(--measurement-medium-50) !important;
  border-radius: var(--measurement-medium-60) !important;
  border-top-right-radius: 0 !important;

  font-weight: 500;
  line-height: 1.1;
  word-break: keep-all;

  font-size: var(--fontsize-medium-20) !important;
`;

function UserBubble({ content }: { content: string }) {
  return <Bubble variant="primary">{content}</Bubble>;
}

export default UserBubble;
