"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

type RangeProps = {
  $percentage: number;
};

const RangeAnimation = keyframes`
  from {
    width: 0px;
  }
`;

const RangeContainer = styled.div`
  background-color: var(--font-color-alpha-10);
  width: 100%;
  border-radius: var(--measurement-large-90);
  height: fit-content;
`;
const PointsRange = styled.div<RangeProps>`
  border-radius: var(--measurement-large-90);

  height: var(--measurement-medium-30);
  width: ${({ $percentage }) => `${$percentage}%`};

  background-color: var(--color-green);

  &[data-threshold="true"] {
    background-color: var(--color-orange) !important;
  }

  &[data-empty="true"] {
    background-color: var(--color-red) !important;
  }

  will-change: width;
  transition: ease-in-out 0.2s;
  animation: ${RangeAnimation} 0.75s cubic-bezier(0.075, 0.82, 0.165, 1);
`;

function UsageRange({
  consumedPoints,
  remainingPoints,
  percentage,
}: {
  consumedPoints: number;
  remainingPoints: number;
  percentage: number;
}) {
  return (
    <RangeContainer className="m-b-medium-30">
      <PointsRange
        key={consumedPoints}
        $percentage={Math.min(100, Math.max(0, Number(percentage) * 100))}
        data-empty={Boolean(Number(remainingPoints) === 0)}
        data-threshold={Boolean(Number(percentage) >= 0.3)}
      />
    </RangeContainer>
  );
}

export default UsageRange;
