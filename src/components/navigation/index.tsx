"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";

import SignedOutLinks from "./SignedOutLinks";
import SignedOutActions from "./SignedOutActions";
import SignedInActions from "./SignedInActions";

import { Page, Button, Badge, Avatar } from "@usefui/components";
import { Icon, SocialIcon } from "@usefui/icons";

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

      <div className="flex g-medium-30 align-center justify-end w-100">
        <Button variant="ghost" sizing="small">
          <Icon viewBox="0 0 15 15">
            <SocialIcon.Github />
          </Icon>
        </Button>
        <Badge variant="border">&beta;&nbsp;1.0.0</Badge>

        <SignedOutActions />
      </div>
    </StyledMenu>
  );
}

export default Navigation;
