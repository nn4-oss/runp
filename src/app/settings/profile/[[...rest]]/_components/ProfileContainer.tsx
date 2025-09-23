"use client";

import React from "react";
import styled from "styled-components";

import { Button } from "@usefui/components";
import { UserProfile } from "@clerk/nextjs";
import { Spinner, FixedHeader } from "@/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";

const ClerkProfileWrapper = styled.div`
  .cl-rootBox,
  .cl-cardBox {
    width: 100% !important;
  }
`;

function ProfileContainer() {
  return (
    <React.Fragment>
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
            <Icon>
              <PixelIcon.Open />
            </Icon>
          </Button>
        </div>
      </FixedHeader>

      <ClerkProfileWrapper className="p-medium-30 flex align-start justify-center h-100 w-100 ">
        <UserProfile fallback={<Spinner />} />
      </ClerkProfileWrapper>
    </React.Fragment>
  );
}

export default ProfileContainer;
