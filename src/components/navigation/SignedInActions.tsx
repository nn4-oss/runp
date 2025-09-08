"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { SignedIn } from "@clerk/nextjs";
import { Button, Dialog, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { Pill, UpgradeScopeDialog, UserAvatar } from "../";

import { ScopeEnum } from "generated/prisma";

function SignedInActions() {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.get.queryOptions());

  return (
    <SignedIn>
      <span className="opacity-default-10">/</span>
      <UserAvatar />
      <span className="opacity-default-10">/</span>

      <div className="flex align-center g-medium-10">
        <Tooltip content="New chat">
          <Button
            variant="border"
            sizing="small"
            aria-label="Projects"
            onMouseDown={() => router.push("/")}
          >
            <span className="flex align-center justify-center p-y-small-60 g-medium-10">
              <Icon>
                <PixelIcon.Plus />
              </Icon>
            </span>
          </Button>
        </Tooltip>

        <Tooltip content="Projects">
          <Button
            variant="border"
            sizing="small"
            aria-label="Projects"
            onMouseDown={() => router.push("/projects")}
          >
            <span className="flex align-center justify-center p-y-small-60">
              <Icon>
                <PixelIcon.Folder />
              </Icon>
            </span>
          </Button>
        </Tooltip>

        {user?.scope === ScopeEnum.FREE && (
          <Dialog.Root>
            <Dialog.Trigger variant="border" sizing="medium">
              <span className="flex align-center justify-center p-y-small-60">
                Upgrade
              </span>
            </Dialog.Trigger>

            <UpgradeScopeDialog />
          </Dialog.Root>
        )}
        {user?.scope === ScopeEnum.PRO && (
          <Tooltip content="Settings">
            <Button
              variant="border"
              sizing="small"
              aria-label="Settings"
              onMouseDown={() => router.push("/settings")}
            >
              <span className="flex align-center justify-center p-y-small-60 g-medium-10">
                <Icon>
                  <PixelIcon.Sliders />
                </Icon>
              </span>
            </Button>
            <Pill data-mode="pending" />
          </Tooltip>
        )}
      </div>
    </SignedIn>
  );
}

export default SignedInActions;
