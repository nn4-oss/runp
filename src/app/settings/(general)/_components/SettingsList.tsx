"use client";

import React, { useCallback } from "react";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

import GeneralSettings from "./GeneralSettings";

import { FixedHeader, Spinner } from "@/components";
import { Button, Page } from "@usefui/components";

import { toast } from "sonner";

function SettingsList() {
  const trpc = useTRPC();

  const { data: user, isPending } = useQuery(trpc.user.get.queryOptions());
  const { data: config } = useQuery(
    trpc.configuration.getLatestVersion.queryOptions(),
  );

  const isFreeScope = user?.scope === "FREE";
  const hasDefaultConfig =
    config?.diagrams === false && config?.additionalPrompt === "";
  const disableReset = isPending || isFreeScope || hasDefaultConfig;

  const deleteConfig = useMutation(
    trpc.configuration.update.mutationOptions({
      onSuccess: () => {
        if (!window) return;
        window.location.reload();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const handleReset = useCallback(async () => {
    if (!config) return;

    return await deleteConfig.mutateAsync({
      id: String(config?.id),
      diagrams: false,
      additionalPrompt: "",
    });
  }, [config]);

  return (
    <Page.Content className="w-100 h-100" scrollbar>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">Application Settings</p>

          <Button
            variant="border"
            sizing="medium"
            disabled={disableReset || deleteConfig.isPending}
            onClick={handleReset}
          >
            Reset default
            {deleteConfig.isPending && <Spinner />}
          </Button>
        </div>
      </FixedHeader>

      <div className="p-medium-30 w-100">
        <GeneralSettings />
      </div>
    </Page.Content>
  );
}

export default SettingsList;
