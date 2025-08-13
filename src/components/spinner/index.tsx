"use client";

import styled, { keyframes } from "styled-components";

const Rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const Spinner = styled.span`
  width: var(--measurement-medium-60);
  height: var(--measurement-medium-60);
  border: var(--measurement-small-60) solid var(--font-color-alpha-30);
  border-bottom-color: transparent;
  border-radius: var(--measurement-large-90);
  display: inline-block;
  box-sizing: border-box;
  transform-origin: center center;
  animation: ${Rotate} 1s linear infinite;
`;
