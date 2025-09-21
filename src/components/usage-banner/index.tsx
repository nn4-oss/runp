"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { Badge, Button, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

import { formatDuration, intervalToDuration } from "date-fns";

const Banner = styled(Badge)`
  flex-wrap: wrap;
  justify-content: space-between !important;
  gap: var(--measurement-medium-60) !important;
  width: 100% !important;
  padding: var(--measurement-medium-30) !important;

  &[data-mode="error"] {
    span {
      color: var(--color-red) !important;
    }
  }
  &[data-mode="warning"] {
    span {
      color: var(--color-orange) !important;
    }
  }
  &[data-mode="meta"] {
    span {
      color: var(--color-blue) !important;
    }
  }
`;

type UsageBannerProps = {
  points: number;
  beforeNext: number;
};

function UsageBanner({ points, beforeNext }: UsageBannerProps) {
  const [show, setShow] = React.useState(true);

  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.getMetadata.queryOptions());

  const getVariant = () => {
    const usagePercentage = usage?.percentage ?? 0;

    const dangerThreshold = usagePercentage >= 0.9; // Less than 10% of total points
    const warningThreshold = usagePercentage >= 0.7; // Less than 30% of total points

    if (dangerThreshold) return "error";
    if (warningThreshold) return "warning";

    return "meta";
  };

  const resetInterval = formatDuration(
    intervalToDuration({
      start: new Date(),
      end: new Date(Date.now() + beforeNext),
    }),
    {
      format: ["months", "days", "hours"],
    },
  );

  if (!show) return <React.Fragment />;
  if (getVariant() === "meta") return <React.Fragment />;

  return (
    <Banner variant={getVariant()} data-mode={getVariant()}>
      <div className="grid w-auto">
        <span className="fs-medium-10">
          {points}&nbsp;message{points > 1 && "s"}&nbsp;left
        </span>
        <span className="fs-medium-10 opacity-default-60">
          Resets&nbsp;in&nbsp;
          {resetInterval}
        </span>
      </div>

      <Tooltip content="Hide">
        <Button variant="ghost" onClick={() => setShow(false)}>
          <Icon>
            <PixelIcon.Close />
          </Icon>
        </Button>
      </Tooltip>
    </Banner>
  );
}

export default UsageBanner;
