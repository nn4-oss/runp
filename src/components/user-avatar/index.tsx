"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import {
  Avatar,
  Badge,
  Dialog,
  Divider,
  DropdownMenu,
  ScrollArea,
} from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { UsageRange } from "..";

import { formatDuration, intervalToDuration } from "date-fns";

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

const stripLongString = (content?: string) => {
  if (Number(content?.length) >= 18) return `${content?.substring(0, 18)}..`;
  else return content;
};

function UserAvatar() {
  const clerkUser = useUser();
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

  const avatarImageSrc =
    clerkUser?.user?.imageUrl ?? user?.imageUrl ?? "/gradient.svg";

  return (
    <DropdownMenu.Root>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <StyledAvatar src={avatarImageSrc} />
          <div className="flex align-center g-medium-10 ">
            {user?.scope && (
              <Badge variant="secondary">
                <span className="fs-small-50">{user.scope}</span>
              </Badge>
            )}
          </div>
        </DropdownMenu.Trigger>

        <ScrollArea as={DropdownMenu.Content}>
          {user?.name && (
            <header className="grid p-x-medium-30 p-t-medium-30">
              <div className="flex align-center g-medium-30">
                <Avatar src={avatarImageSrc} sizing="small" />
                <hgroup className="grid">
                  <p className="fs-medium-10">
                    {stripLongString(String(user?.name))}
                  </p>
                  <span className="fs-small-60 opacity-default-60">
                    {stripLongString(String(user.email))}
                  </span>
                </hgroup>
              </div>

              <Divider className="m-y-medium-50" />
            </header>
          )}

          {usage && usageMetadata && (
            <PointsWrapper className="p-medium-30 m-b-medium-30">
              <hgroup className="flex align-center justify-between m-b-medium-30">
                <p className="fs-medium-10 opacity-default-60">Messages</p>
                <p className="fs-medium-10">
                  {usage?.remainingPoints}&nbsp;left
                </p>
              </hgroup>
              <UsageRange
                consumedPoints={Number(usage?.consumedPoints)}
                remainingPoints={Number(usage?.remainingPoints)}
                percentage={Number(usageMetadata?.percentage)}
              />

              <span className="fs-small-60 opacity-default-30 flex align-center g-medium-10">
                <Icon>
                  <PixelIcon.Reload />
                </Icon>
                Reset&nbsp;in&nbsp;
                {resetDuration}
              </span>
            </PointsWrapper>
          )}

          <Dialog.Trigger
            rawicon
            variant="ghost"
            style={{
              width: "100%",
              justifyContent: "start",
            }}
          >
            <DropdownMenu.Item className="w-100 flex align-center g-medium-30">
              <span>
                <Icon>
                  <PixelIcon.Zap />
                </Icon>
              </span>
              Subscription
              <span className="flex align-center justify-end w-100">
                {user?.scope && (
                  <Badge variant="secondary">
                    <span className="fs-small-50">{user.scope}</span>
                  </Badge>
                )}
              </span>
            </DropdownMenu.Item>
          </Dialog.Trigger>

          <Divider className="m-y-medium-10" />

          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onMouseDown={() => router.push("/settings/profile")}
          >
            <span>
              <Icon>
                <PixelIcon.User />
              </Icon>
            </span>
            Profile
            <span className="flex align-center justify-end w-100">
              <Icon viewBox="0 0 18 18">
                <SocialIcon.Clerk />
              </Icon>
            </span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="w-100 flex align-center g-medium-30"
            onMouseDown={() => router.push("/settings")}
          >
            <Icon>
              <PixelIcon.Sliders />
            </Icon>
            Settings
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
