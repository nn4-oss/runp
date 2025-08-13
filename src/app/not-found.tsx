"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { Button, Page } from "@usefui/components";

const Hgroup = styled.hgroup`
  text-align: center;

  button {
    justify-self: center;
  }
`;

function NotFoundPage() {
  const router = useRouter();

  return (
    <Page>
      <Page.Content>
        <section className="grid h-100 justify-center align-center">
          <section>
            <Hgroup className="grid g-medium-30 align-center justify-center">
              <h1 className="fs-large-10">Not Found</h1>
              <p className="fs-medium-20 opacity-default-60 m-b-medium-60">
                If you believe this is an error, please contact the support.
              </p>

              <Button
                variant="border"
                sizing="large"
                onClick={() => router.push("/")}
              >
                Go back
              </Button>
            </Hgroup>
          </section>
        </section>
      </Page.Content>
    </Page>
  );
}

export default NotFoundPage;
