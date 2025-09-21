"use client";

import styled, { keyframes } from "styled-components";

const Pulse = keyframes`
  0% {
    box-shadow: 0 0 0 var(--measurement-small-10) var(--alpha-green-30);
  }
  100% {
    box-shadow: 0 0 0 var(--measurement-medium-10) transparent;
  }
`;
const PulseWarning = keyframes`
  0% {
    box-shadow: 0 0 0 var(--measurement-small-10) var(--alpha-red-30);
  }
  100% {
    box-shadow: 0 0 0 var(--measurement-medium-10) transparent;
  }
`;

export const Pill = styled.span`
  position: absolute;
  top: calc(var(--measurement-small-60) * -1);
  right: calc(var(--measurement-small-60) * -1);
  width: var(--measurement-medium-30);
  height: var(--measurement-medium-30);
  border-radius: var(--measurement-large-90);

  &[data-mode="success"] {
    background-color: var(--color-green);
    animation: ${Pulse} 2s ease-in-out infinite;
  }
  &[data-mode="pending"] {
    background-color: var(--color-orange);
    animation: ${PulseWarning} 1s ease-in-out infinite;
  }
  &[data-mode="urgent"] {
    background-color: var(--color-red);
    animation: ${PulseWarning} 1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
  }
`;
