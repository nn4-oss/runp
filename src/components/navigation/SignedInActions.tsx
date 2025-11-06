"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import UpgradeScopeDialog from "../dialogs/UpgradeScopeDialog";
import SendFeedbackDialog from "../dialogs/SendFeedbackDialog";

import { SignedIn } from "@clerk/nextjs";
import { Button, Dialog, Tooltip } from "@usefui/components";
import { Icon } from "@usefui/icons";

import { ScopeEnum } from "generated/prisma";

function SignedInActions() {
  const router = useRouter();
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.user.get.queryOptions());

  return (
    <SignedIn>
      <div className="flex align-center g-small-30">
        <Tooltip content="New chat">
          <Button
            variant="tertiary"
            sizing="small"
            animation="reflective"
            aria-label="Projects"
            onMouseDown={() => router.push("/")}
          >
            <span className="flex align-center justify-center p-y-small-60 g-medium-10">
              <Icon>
                <Icon.Add />
              </Icon>
            </span>
          </Button>
        </Tooltip>

        <Tooltip content="Projects">
          <Button
            variant="tertiary"
            sizing="small"
            animation="reflective"
            aria-label="Projects"
            onMouseDown={() => router.push("/projects")}
          >
            <span className="flex align-center justify-center p-y-small-60">
              <Icon>
                <Icon.CodeFolder />
              </Icon>
            </span>
          </Button>
        </Tooltip>

        <Dialog.Root>
          <Tooltip content="Feedback">
            <Dialog.Trigger
              variant="tertiary"
              sizing="small"
              animation="reflective"
            >
              <span className="flex align-center justify-center p-y-small-60 g-medium-10">
                <Icon>
                  <Icon.Announcement />
                </Icon>
              </span>
            </Dialog.Trigger>
          </Tooltip>

          <SendFeedbackDialog />
        </Dialog.Root>

        {user?.scope === ScopeEnum.FREE && (
          <Dialog.Root>
            <Dialog.Trigger
              variant="secondary"
              sizing="medium"
              animation="reflective"
            >
              Upgrade
            </Dialog.Trigger>

            <UpgradeScopeDialog />
          </Dialog.Root>
        )}
      </div>
    </SignedIn>
  );
}

export default SignedInActions;
