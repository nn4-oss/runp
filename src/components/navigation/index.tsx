"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import AppOptions from "./AppOptions";
import BrandIcon from "../brand-icon";
import SignedInActions from "./SignedInActions";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Page, Dialog, Button } from "@usefui/components";
import { Icon } from "@usefui/icons";

import { UpgradeScopeDialog, UserAvatar } from "..";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background: transparent !important;
`;

function Navigation() {
  const router = useRouter();

  return (
    <StyledMenu className="w-100 flex p-x-medium-30 align-center justify-between">
      <div className="flex align-center g-medium-30 w-100">
        <Button variant="ghost" rawicon onMouseDown={() => router.push("/")}>
          <Icon fill="none" width={24} height={24} viewBox="0 0 32 48">
            <BrandIcon />
          </Icon>
        </Button>

        <SignedInActions />
      </div>

      <div className="flex g-medium-10 align-center justify-end w-100">
        <SignedOut>
          <SignInButton>
            <Button variant="secondary" sizing="medium" animation="reflective">
              Sign&nbsp;In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="mono" sizing="medium" animation="reflective">
              Sign&nbsp;Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Dialog.Root>
            <UserAvatar />
            <UpgradeScopeDialog />
          </Dialog.Root>
        </SignedIn>

        <AppOptions />
      </div>
    </StyledMenu>
  );
}

export default Navigation;
