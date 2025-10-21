"use client";

import React, { useCallback } from "react";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

import GeneralSettings from "./GeneralSettings";

import { FixedHeader, SplitText } from "@/components";
import { Spinner, Button } from "@usefui/components";

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
    <React.Fragment>
      <FixedHeader className="grid">
        <div className="flex justify-between align-center p-y-medium-60 p-x-medium-60">
          <p className="fs-medium-20">
            <SplitText
              stagger={0.02}
              duration={0.1}
              variant="fade"
              text="Application Settings"
            />
          </p>

          <Button
            variant="secondary"
            sizing="medium"
            animation="reflective"
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
    </React.Fragment>
  );
}

export default SettingsList;
