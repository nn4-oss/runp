"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import SubscribeActions from "./SubscribeActions";

import { UsageRange, SkeletonLoader } from "@/components";
import { BorderWrapper } from "./GeneralSettings";
import { Icon, PixelIcon } from "@usefui/icons";

import { formatDuration, intervalToDuration } from "date-fns";
import { POINTS_PER_SCOPE } from "@/utils/scope-features";

function UsageSettings() {
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.user.get.queryOptions());
  const { data: metadata } = useQuery(trpc.usage.getMetadata.queryOptions());
  const { data: usage, isPending: isUsagePending } = useQuery(
    trpc.usage.status.queryOptions(),
  );

  const resetDuration = React.useMemo(() => {
    try {
      const msBeforeNext = Number(usage?.msBeforeNext);
      if (!msBeforeNext || msBeforeNext < 0) {
        return "Unknown";
      }

      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(Date.now() + msBeforeNext),
        }),
        {
          format: ["months", "days", "hours"],
        },
      );
    } catch (error) {
      console.error("Error calculating reset duration:", error);
      return "Unknown";
    }
  }, [usage?.msBeforeNext]);

  const displayUsage = !!usage && !!metadata;

  return (
    <BorderWrapper className="p-medium-60">
      <div className="grid g-medium-60">
        <hgroup className="flex g-medium-10 align-start justify-between">
          <div className=" grid g-medium-10">
            <h6 className="fs-medium-20">Usage</h6>
            <div>
              <p className="fs-medium-10 opacity-default-60">
                You are currently using the&nbsp;
                <b>{user?.scope.toLowerCase() ?? "FREE"}</b>
                &nbsp;plan.
              </p>
              <p className="flex  g-medium-10 fs-medium-10 opacity-default-60">
                Compare plans and options on our
                <Link
                  href="/pricing"
                  target="_blank"
                  className="flex align-center g-medium-10"
                >
                  pricing page
                  <Icon>
                    <PixelIcon.Open />
                  </Icon>
                </Link>
              </p>
            </div>
          </div>

          <SubscribeActions />
        </hgroup>

        <div>
          {displayUsage && (
            <UsageRange
              consumedPoints={usage?.consumedPoints}
              remainingPoints={usage?.remainingPoints}
              percentage={metadata?.percentage}
            />
          )}

          <div className="flex align-center justify-between m-b-medium-30">
            {isUsagePending && <SkeletonLoader />}
            {!isUsagePending && (
              <React.Fragment>
                <p className="fs-medium-10">
                  {usage?.consumedPoints}&nbsp;/&nbsp;
                  {POINTS_PER_SCOPE[user?.scope as "FREE" | "PRO"]}
                  <span className="opacity-default-30">&nbsp;Messages</span>
                </p>

                <span className="fs-small-60 opacity-default-30 flex align-center g-medium-10">
                  <Icon>
                    <PixelIcon.Reload />
                  </Icon>
                  Reset&nbsp;in&nbsp;
                  {resetDuration}
                </span>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </BorderWrapper>
  );
}

export default UsageSettings;
