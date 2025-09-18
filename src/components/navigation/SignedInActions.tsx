"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { SignedIn } from "@clerk/nextjs";
import { Button, Dialog, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { UpgradeScopeDialog, UserAvatar } from "../";

function SignedInActions() {
  const router = useRouter();

  return (
    <SignedIn>
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
      </div>
      <span className="opacity-default-10">/</span>
      <Dialog.Root>
        <UserAvatar />
        <UpgradeScopeDialog />
      </Dialog.Root>
    </SignedIn>
  );
}

export default SignedInActions;
