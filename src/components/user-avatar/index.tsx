"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import {
  Avatar,
  Dialog,
  Divider,
  DropdownMenu,
  ScrollArea,
} from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";
import { SignOutButton } from "@clerk/nextjs";
import { ColorModes, Spinner } from "..";

import { formatDuration, intervalToDuration } from "date-fns";

type RangeProps = {
  $percentage: number;
};

const StyledAvatar = styled(Avatar)`
  width: var(--measurement-medium-80) !important;
  min-width: var(--measurement-medium-80) !important;
  height: var(--measurement-medium-80) !important;
  min-height: var(--measurement-medium-80) !important;

  img {
    opacity: 1 !important;
  }
`;
const PointsWrapper = styled.div`
  background-color: var(--contrast-color);
  border-radius: var(--measurement-medium-30);
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
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
`;

function UserAvatar() {
  const router = useRouter();
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.user.get.queryOptions());
  const { data: usage } = useQuery(trpc.usage.status.queryOptions());
  const { data: usageMetadata } = useQuery(
    trpc.usage.getMetadata.queryOptions(),
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

  return (
    <DropdownMenu.Root>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <StyledAvatar src={user?.imageUrl ?? "/gradient.svg"} />
        </DropdownMenu.Trigger>
        <ScrollArea as={DropdownMenu.Content}>
          {user?.name && (
            <div className="grid p-l-medium-30 p-t-medium-30">
              <p className="fs-medium-20">{user?.name}</p>
              <span className="fs-medium-10 opacity-default-60">
                {user?.email}
              </span>

              <Divider className="m-y-medium-50" />
            </div>
          )}

          {usage && usageMetadata && (
            <PointsWrapper className="p-medium-30 m-b-medium-60">
              <hgroup className="flex align-center justify-between m-b-medium-30">
                <p className="fs-medium-10 opacity-default-60">Messages</p>
                <p className="fs-medium-10">
                  {usage?.remainingPoints}&nbsp;left
                </p>
              </hgroup>

              <RangeContainer className="m-b-medium-30">
                <PointsRange
                  key={usage?.consumedPoints}
                  $percentage={Math.min(
                    100,
                    Math.max(0, Number(usageMetadata?.percentage) * 100),
                  )}
                  data-empty={Boolean(Number(usage?.remainingPoints) === 0)}
                  data-threshold={Boolean(
                    Number(usageMetadata?.percentage) >= 0.3,
                  )}
                />
              </RangeContainer>

              <span className="fs-small-60 opacity-default-30 flex align-center g-medium-10">
                <Icon>
                  <PixelIcon.Reload />
                </Icon>
                Reset&nbsp;in&nbsp;
                {resetDuration}
              </span>
            </PointsWrapper>
          )}

          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onClick={() => router.push("/profile")}
          >
            <Icon>
              <PixelIcon.User />
            </Icon>
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onClick={() => router.push("/settings")}
          >
            <Icon>
              <PixelIcon.Sliders />
            </Icon>
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex align-center g-medium-30"
            onClick={() => router.push("/docs/introduction")}
          >
            <span className="flex align-center justify-center">
              <Icon>
                <PixelIcon.BookOpen />
              </Icon>
            </span>
            Documentation
            <div className="flex w-100 justify-end">
              <Icon>
                <PixelIcon.Open />
              </Icon>
            </div>
          </DropdownMenu.Item>
          <Divider className="m-y-medium-10" />

          <DropdownMenu.Item
            className="flex align-center g-medium-30"
            onClick={() => router.push("/settings/api-keys")}
          >
            <span className="flex align-center justify-center">
              <Icon>
                <SocialIcon.OpenAi />
              </Icon>
            </span>
            API&nbsp;Keys
            <div className="flex w-100 justify-end">
              <Icon>
                <PixelIcon.Open />
              </Icon>
            </div>
          </DropdownMenu.Item>

          <Divider className="m-y-medium-10" />

          <DropdownMenu.Item className="flex align-center g-medium-30" radio>
            <span className="flex align-center justify-center">
              <Icon>
                <PixelIcon.Contrast />
              </Icon>
            </span>
            Theme
            <div className="flex w-100 justify-end">
              <ColorModes />
            </div>
          </DropdownMenu.Item>

          <Divider className="m-y-medium-10" />

          <SignOutButton>
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <Icon>
                <PixelIcon.Logout />
              </Icon>
              Sign&nbsp;Out
            </DropdownMenu.Item>
          </SignOutButton>
        </ScrollArea>
      </DropdownMenu>
    </DropdownMenu.Root>
  );
}

export default UserAvatar;
