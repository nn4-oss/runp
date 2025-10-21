"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Textarea } from "@/components";
import {
  Badge,
  Button,
  Checkbox,
  Spinner,
  Divider,
  Skeleton,
  Card,
} from "@usefui/components";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const TextareaLg = styled(Textarea)`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);

  background: var(--contrast-color);

  will-change: border-color;
  transition: border-color ease-in-out 0.2s;

  &:focus,
  &:hover {
    border-color: var(--font-color-alpha-20);
  }

  height: var(--measurement-large-60) !important;
  max-height: var(--measurement-large-60) !important;
`;

// const MODELS = [
//   "gpt-4.1",
//   "gpt-4",
//   "gpt-4-turbo",
//   "gpt-4o",
//   "gpt-4o-mini",
//   "gpt-3.5-turbo",
// ];

const formSchema = z.object({
  diagrams: z.boolean(),
  additionalPrompt: z
    .string()
    .max(4096, { message: "Value cannot exceed 4096 characters" }),
});

function LLMSettings({ isFreeScope }: { isFreeScope: boolean }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    data: configuration,
    isPending,
    isSuccess,
  } = useQuery(trpc.configuration.getLatestVersion.queryOptions());

  const handleSuccessFallback = React.useCallback(async () => {
    toast.info("Application settings updated");

    await queryClient.invalidateQueries(
      trpc.configuration.getLatestVersion.queryOptions(),
    );
  }, []);

  const createConfig = useMutation(
    trpc.configuration.create.mutationOptions({
      onSuccess: async () => await handleSuccessFallback(),
      onError: (error) => toast.error(error.message),
    }),
  );
  const updateConfig = useMutation(
    trpc.configuration.update.mutationOptions({
      onSuccess: async () => await handleSuccessFallback(),
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagrams: configuration?.diagrams ?? false,
      additionalPrompt: configuration?.additionalPrompt ?? "",
    },
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (!configuration) {
        return await createConfig.mutateAsync({
          diagrams: values.diagrams,
          additionalPrompt: values.additionalPrompt,
        });
      }

      return await updateConfig.mutateAsync({
        id: String(configuration?.id),
        diagrams: values.diagrams,
        additionalPrompt: values.additionalPrompt,
      });
    },
    [configuration, createConfig, updateConfig],
  );

  React.useEffect(() => {
    if (configuration) {
      form.reset({
        diagrams: configuration.diagrams,
        additionalPrompt: configuration.additionalPrompt,
      });
    }
  }, [configuration, form]);

  return (
    <Card.Body className="p-medium-60">
      {isPending && (
        <div className="flex justify-between align-start g-large-10">
          <Skeleton />
          <Spinner />
        </div>
      )}
      {isSuccess && (
        <form onSubmit={form.handleSubmit(onSubmit)} key={configuration?.id}>
          <div className="flex align-center justify-between g-medium-10">
            <hgroup className="w-100 grid g-medium-10">
              <div className="flex g-medium-10 align-center">
                <h6 className="fs-medium-20">Feature Diagram</h6>
                {isFreeScope && (
                  <Badge
                    variant="warning"
                    shape="round"
                    className="fs-small-60 p-b-small-10"
                  >
                    Runp Pro
                  </Badge>
                )}
              </div>

              <p className="fs-medium-10 opacity-default-60">
                Automatically generate feature maps, or ER specs alongside the
                generated code.
              </p>
            </hgroup>
            <Checkbox.Root>
              <Checkbox
                id="diagrams"
                sizing="medium"
                variant="secondary"
                disabled={isFreeScope}
                defaultChecked={configuration?.diagrams}
                onClick={() => {
                  form.setValue("diagrams", !Boolean(configuration?.diagrams));
                }}
              >
                <Checkbox.Indicator />
              </Checkbox>
            </Checkbox.Root>
          </div>

          <Divider className="m-y-medium-50" />

          <div className="grid g-medium-60 m-b-medium-60">
            <hgroup className="w-100 grid g-medium-10">
              <div className="flex g-medium-10 align-center">
                <h6 className="fs-medium-20">LLM Instructions</h6>
                {isFreeScope && (
                  <Badge
                    variant="warning"
                    shape="round"
                    className="fs-small-60 p-b-small-10"
                  >
                    Runp Pro
                  </Badge>
                )}
              </div>
              <p className="fs-medium-10 opacity-default-60">
                Custom instructions used on top of the current system prompt.
              </p>
            </hgroup>

            <TextareaLg
              id="additionalPrompt"
              autoComplete="off"
              className="p-medium-30"
              placeholder="e.g. Use GSAP for animation. Always include Dark Mode support..."
              disabled={isFreeScope}
              {...form.register("additionalPrompt")}
            />
          </div>

          <footer className="w-100 flex justify-end align-center">
            <Button
              variant="primary"
              sizing="medium"
              animation="reflective"
              disabled={
                isFreeScope || createConfig.isPending || updateConfig.isPending
              }
              onClick={form.handleSubmit(onSubmit)}
            >
              Save
              {createConfig.isPending ||
                (updateConfig.isPending && <Spinner />)}
            </Button>
          </footer>
        </form>
      )}
    </Card.Body>
  );
}

export default LLMSettings;
