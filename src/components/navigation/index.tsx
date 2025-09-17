"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import SignedOutLinks from "./SignedOutLinks";
import SignedOutActions from "./SignedOutActions";
import SignedInActions from "./SignedInActions";

import { Page, Button, Dialog, Avatar, Tooltip } from "@usefui/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";

import { ScopeEnum } from "generated/prisma";
import { UpgradeScopeDialog } from "..";
import { SignedIn } from "@clerk/nextjs";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background: transparent !important;
`;
const BrandAvatar = styled(Avatar)`
  background-color: var(--font-color) !important;
  width: var(--measurement-medium-80) !important;
  min-width: var(--measurement-medium-80) !important;
  height: var(--measurement-medium-80) !important;
  min-height: var(--measurement-medium-80) !important;
`;

function Navigation() {
  const router = useRouter();
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.user.get.queryOptions());

  return (
    <StyledMenu className="w-100 flex p-x-medium-30 align-center justify-between">
      <div className="flex align-center g-medium-30 w-100">
        <Button variant="ghost" rawicon onMouseDown={() => router.push("/")}>
          <BrandAvatar sizing="small">
            <Icon fill="var(--body-color)">
              <SocialIcon.Foundation />
            </Icon>
          </BrandAvatar>
        </Button>

        <SignedInActions />
        <SignedOutLinks />
      </div>

      <div className="flex g-medium-10 align-center justify-end w-100">
        <SignedIn>
          {user?.scope === ScopeEnum.FREE && (
            <Dialog.Root>
              <Dialog.Trigger variant="primary" sizing="medium">
                Upgrade
              </Dialog.Trigger>

              <UpgradeScopeDialog />
            </Dialog.Root>
          )}
        </SignedIn>

        <Tooltip content="Documentation">
          <Button variant="border" sizing="small" disabled>
            <span className="flex align-center justify-center p-y-small-60">
              <Icon>
                <PixelIcon.BookOpen />
              </Icon>
            </span>
          </Button>
        </Tooltip>

        <Tooltip content="Github">
          <Button
            variant="border"
            sizing="small"
            onClick={() =>
              window.open(
                "https://github.com/nn4-oss/runp",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <span className="flex align-center justify-center p-y-small-60">
              <Icon viewBox="0 0 15 15">
                <SocialIcon.Github />
              </Icon>
            </span>
          </Button>
        </Tooltip>

        <SignedOutActions />
      </div>
    </StyledMenu>
  );
}

export default Navigation;
