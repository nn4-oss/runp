"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import CredentialsListActions from "./CredentialsListActions";
import CredentialsTable from "./CredentialsTable";

import { AppContainer } from "@/components";

const FixedHeader = styled.hgroup`
  position: sticky;
  top: 0;
  background-color: var(--contrast-color);
  border-bottom: var(--measurement-small-30) solid var(--font-color-alpha-10);
  width: 100%;
  z-index: var(--depth-default-10);
`;

function CredentialsList() {
  const trpc = useTRPC();
  const { data: credentials } = useSuspenseQuery(
    trpc.credentials.getMany.queryOptions(),
  );

  const hasData = credentials.length !== 0;

  return (
    <AppContainer
      className="h-100 w-100 "
      scrollbar
      style={{ position: "relative" }}
    >
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">API Keys&nbsp;</p>

          <CredentialsListActions />
        </div>
      </FixedHeader>

      <div className="p-medium-30 grid w-100 ">
        {!hasData && (
          <div className="flex align-center justify-center w-100 p-y-large-10">
            <p className="fs-medium-10 opacity-default-30">No API Key found</p>
          </div>
        )}

        {hasData && <CredentialsTable data={credentials} />}
      </div>
    </AppContainer>
  );
}

export default CredentialsList;
