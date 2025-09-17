"use client";

import React from "react";
import styled from "styled-components";

import { Button, Page } from "@usefui/components";
import { UserProfile } from "@clerk/nextjs";
import { Spinner, FixedHeader } from "@/components";
import { Icon, SocialIcon } from "@usefui/icons";

const ClerkProfileWrapper = styled.div`
  .cl-rootBox,
  .cl-cardBox {
    width: 100% !important;
  }
`;

function ProfileContainer() {
  return (
    <Page.Content className="w-100 h-100" scrollbar>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">Profile</p>

          <Button
            variant="border"
            sizing="medium"
            onClick={() =>
              window.open("https://clerk.com/", "_blank", "noopener,noreferrer")
            }
          >
            <Icon viewBox="0 0 18 18">
              <SocialIcon.Clerk />
            </Icon>
            Powered by Clerk
          </Button>
        </div>
      </FixedHeader>

      <ClerkProfileWrapper className="p-medium-30 flex align-start justify-center h-100 w-100 ">
        <UserProfile fallback={<Spinner />} />
      </ClerkProfileWrapper>
    </Page.Content>
  );
}

export default ProfileContainer;
