"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

import AppLayout from "@/layouts/AppLayout";
import { Button } from "@usefui/components";
import { AppContainer } from "@/components";

const Hgroup = styled.hgroup`
  text-align: center;

  button {
    justify-self: center;
  }
`;

function NotFoundPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <AppContainer className="flex w-100 h-100 justify-center align-center">
        <Hgroup>
          <h1>Not Found</h1>
          <p className="fs-medium-20 opacity-default-30 m-b-medium-60">
            If you believe this is an error, please contact the support.
          </p>

          <Button
            variant="border"
            sizing="large"
            onMouseDown={() => router.push("/")}
          >
            Go back
          </Button>
        </Hgroup>
      </AppContainer>
    </AppLayout>
  );
}

export default NotFoundPage;
