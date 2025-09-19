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
    config?.at(0)?.diagrams === false && config?.at(0)?.additionalPrompt === "";
  const disableReset = isPending || isFreeScope || hasDefaultConfig;

  const updateConfig = useMutation(
    trpc.configuration.update.mutationOptions({
      onSuccess: () => {
        window && window.location.reload();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const handleReset = useCallback(async () => {
    return await updateConfig.mutateAsync({
      id: String(config?.at(0)?.id),
      diagrams: false,
      additionalPrompt: "",
    });
  }, []);

  return (
    <Page.Content className="w-100 h-100" scrollbar>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">Application Settings</p>

          <Button
            variant="border"
            sizing="medium"
            disabled={disableReset || updateConfig.isPending}
            onClick={handleReset}
          >
            Reset default
            {updateConfig.isPending && <Spinner />}
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
