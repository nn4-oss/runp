"use client";

import styled from "styled-components";

import SignedOutLinks from "./SignedOutLinks";
import SignedOutActions from "./SignedOutActions";
import SignedInActions from "./SignedInActions";

import { Page, Button, Badge } from "@usefui/components";
import { Icon, SocialIcon } from "@usefui/icons";

const StyledMenu = styled(Page.Navigation)`
  border: none !important;
  background-color: transparent;
`;

function Navigation() {
  return (
    <StyledMenu className="w-100 flex p-x-medium-30 align-center justify-between">
      <div className="flex align-center g-medium-30 w-100">
        <Icon width={18} height={18}>
          <SocialIcon.Foundation />
        </Icon>

        <SignedInActions />
        <SignedOutLinks />
      </div>

      <div className="flex g-medium-30 align-center">
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
