"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

import PagesLayout from "@/layouts/PagesLayout";
import { Button } from "@usefui/components";

const Hgroup = styled.hgroup`
  text-align: center;

  button {
    justify-self: center;
  }
`;

function NotFoundPage() {
  const router = useRouter();

  return (
    <PagesLayout>
      <section className="flex w-100 h-100 justify-center align-center">
        <Hgroup>
          <h1>Not Found</h1>
          <p className="fs-medium-20 opacity-default-30 m-b-medium-60">
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
    </PagesLayout>
  );
}

export default NotFoundPage;
