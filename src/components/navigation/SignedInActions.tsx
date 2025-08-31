"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ReflectiveButton from "../reflective-button";
import UserAvatar from "../user-avatar";

import { SignedIn } from "@clerk/nextjs";
import { Sheet, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";

function SignedInActions() {
  const router = useRouter();

  return (
    <SignedIn>
      <span className="opacity-default-10">/</span>
      <UserAvatar />
      <span className="opacity-default-10">/</span>

      <div className="flex align-center g-medium-10">
        <Tooltip content="New chat">
          <ReflectiveButton
            variant="border"
            sizing="small"
            aria-label="Projects"
            onClick={() => router.push("/")}
          >
            <span className="flex align-center justify-center p-y-small-60 g-medium-10">
              <Icon>
                <PixelIcon.Plus />
              </Icon>
            </span>
          </ReflectiveButton>
        </Tooltip>

        <Sheet.Root>
          <Tooltip content="Projects">
            <ReflectiveButton
              variant="border"
              sizing="small"
              aria-label="Projects"
              onClick={() => router.push("/projects")}
            >
              <span className="flex align-center justify-center p-y-small-60">
                <Icon>
                  <PixelIcon.Folder />
                </Icon>
              </span>
            </ReflectiveButton>
          </Tooltip>
        </Sheet.Root>
      </div>
    </SignedIn>
  );
}

export default SignedInActions;
