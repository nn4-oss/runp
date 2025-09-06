"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import { Badge, Dialog } from "@usefui/components";
import { UpgradeScopeDialog } from "../";

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
  const router = useRouter();

  const getVariant = () => {
    if (points === 0) return "error";
    if (points <= 2) return "warning";
    if (points >= 3) return "meta";
  };

  const duration = intervalToDuration({
    start: new Date(),
    end: new Date(Date.now() + beforeNext),
  });

  const resetInterval = formatDuration(duration, {
    format: ["months", "days", "hours"],
  });

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

      <Dialog.Root>
        <Dialog.Trigger variant="primary" sizing="medium">
          Upgrade
        </Dialog.Trigger>

        <UpgradeScopeDialog />
      </Dialog.Root>
    </Banner>
  );
}

export default UsageBanner;
