"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import SubscribeActions from "./SubscribeActions";

import { Card, Skeleton, Spinner } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { UsageRange } from "@/components";

import { formatDuration, intervalToDuration } from "date-fns";
import { POINTS_PER_SCOPE } from "@/utils/scope-features";

function UsageSettings() {
  const trpc = useTRPC();

  const { data: user, isPending: isUserPending } = useQuery(
    trpc.user.get.queryOptions(),
  );
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
    <Card.Body className="p-medium-60">
      <div className="grid g-medium-60">
        {isUserPending && (
          <div className="flex justify-between align-start g-large-10">
            <Skeleton />
            <Spinner />
          </div>
        )}
        {!isUserPending && (
          <hgroup className="flex g-medium-10 align-start justify-between">
            <div className=" grid g-medium-10">
              <h6 className="fs-medium-20">Usage</h6>
              <div>
                <p className="fs-medium-10 opacity-default-60">
                  You are currently on the&nbsp;
                  <b>{user?.scope.toLowerCase()}</b>
                  &nbsp;plan.
                </p>
                <p className="flex  g-medium-10 fs-medium-10 opacity-default-60">
                  Compare plans and options on our
                  <Link
                    href="/settings/pricing"
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
        )}

        <div>
          {displayUsage && (
            <UsageRange
              consumedPoints={usage?.consumedPoints}
              remainingPoints={usage?.remainingPoints}
              percentage={metadata?.percentage}
            />
          )}

          <div className="flex align-center justify-between m-b-medium-30">
            {isUsagePending && <Skeleton />}
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
    </Card.Body>
  );
}

export default UsageSettings;
