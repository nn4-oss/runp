"use client";

import styled from "styled-components";

export const Skeleton = styled.span`
  @keyframes blink {
    0% {
      opacity: 0;
      width: 0%;
    }
    50% {
      width: 100%;
    }
  }

  animation: blink 1s linear alternate-reverse infinite;
  background: linear-gradient(45deg, var(--font-color-alpha-10), transparent);
  border-radius: var(--measurement-medium-10);
  height: var(--measurement-large-20);
  width: 100%;
`;

function SkeletonLoader({ ...props }) {
  return <Skeleton {...props} />;
}

export default SkeletonLoader;
