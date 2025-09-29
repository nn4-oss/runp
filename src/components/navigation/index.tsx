"use client";

import React from "react";
import styled from "styled-components";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import AppAvatar from "./AppAvatar";
import SignedOutActions from "./SignedOutActions";
import SignedInActions from "./SignedInActions";

import { Page, Dialog } from "@usefui/components";
import { ScopeEnum } from "generated/prisma";
import { UpgradeScopeDialog } from "..";
import { SignedIn } from "@clerk/nextjs";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background: transparent !important;
`;
function Navigation() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.get.queryOptions());

  return (
    <StyledMenu className="w-100 flex p-x-medium-30 align-center justify-between">
      <div className="flex align-center g-medium-30 w-100">
        <AppAvatar />
        <SignedInActions />
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

        <SignedOutActions />
      </div>
    </StyledMenu>
  );
}

export default Navigation;
