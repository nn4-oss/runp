"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import CredentialsListActions from "./CredentialsListActions";
import CredentialsTable from "./CredentialsTable";

import { FixedHeader, Spinner } from "@/components";
import { Page } from "@usefui/components";

function CredentialsList() {
  const trpc = useTRPC();
  const { data: credentials, isPending } = useQuery(
    trpc.credentials.getMany.queryOptions(),
  );

  if (isPending) {
    return (
      <Page.Content className="w-100 h-100 flex align-center justify-center">
        <Spinner />
      </Page.Content>
    );
  }

  const hasData = credentials && credentials?.length !== 0;

  return (
    <Page.Content className="w-100 h-100" scrollbar>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">API Keys</p>

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
    </Page.Content>
  );
}

export default CredentialsList;
