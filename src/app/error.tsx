"use client";

import React from "react";
import styled from "styled-components";

import AppLayout from "@/layouts/AppLayout";

import { Button } from "@usefui/components";
import { AppContainer } from "@/components";
import { Icon, PixelIcon, SocialIcon } from "@usefui/icons";

const Hgroup = styled.hgroup`
  text-align: center;

  button {
    justify-self: center;
  }
`;

function ErrorPage() {
  return (
    <AppLayout>
      <AppContainer className="flex w-100 h-100 justify-center align-center">
        <Hgroup>
          <div className="flex align-center justify-center g-medium-30">
            <h1>Uh oh</h1>
            <Icon width={36} height={36}>
              <PixelIcon.Downasaur />
            </Icon>
          </div>
          <h1 className="fs-medium-20">
            An error occured, please try to refresh your browser.
          </h1>
          <p className="fs-medium-20 opacity-default-30 m-b-medium-60">
            If you keep getting the error, please contact our support.
          </p>

          <div className="flex align-center justify-center g-medium-30">
            <Button
              variant="border"
              sizing="large"
              onClick={() => window.location.reload()}
            >
              <Icon>
                <PixelIcon.Reload />
              </Icon>
              Refresh
            </Button>
            <Button
              variant="border"
              sizing="large"
              onClick={() =>
                window.open(
                  "https://github.com/nn4-oss/runp/issues",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <Icon viewBox="0 0 14 14">
                <SocialIcon.Github />
              </Icon>
              Open an issue
            </Button>
          </div>
        </Hgroup>
      </AppContainer>
    </AppLayout>
  );
}

export default ErrorPage;
