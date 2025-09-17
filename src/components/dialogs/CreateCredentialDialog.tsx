"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
  Portal,
  Field,
  Checkbox,
  Badge,
  Sheet,
  ScrollArea,
  useSheet,
  Button,
} from "@usefui/components";
import { PrivacyField, Spinner } from "../";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const Banner = styled(Badge)`
  /* width: 100% !important; */
  justify-content: start !important;
  padding: var(--measurement-medium-60) !important;
  gap: var(--measurement-medium-60) !important;
  font-size: var(--fontsize-medium-10) !important;
`;
const Select = styled.select`
  all: unset;
`;
const CheckboxWrapper = styled(Field.Wrapper)`
  border: var(--measurement-small-30) dashed var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);
  padding: var(--measurement-medium-60);

  label {
    cursor: pointer;
  }
`;

const serviceEnum = z.enum(["OPENAI", "E2B"]);

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(128, { message: "Name cannot exceed 128 characters" }),
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(256, { message: "Value cannot exceed 256 characters" }),
  service: serviceEnum,
  isPrimary: z.boolean().default(false),
});

function CreateCredentialDialog() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const sheet = useSheet();

  const createCredential = useMutation(
    trpc.credentials.create.mutationOptions({
      // Invalidation has to be made after every queries and mutation are done.
      // On success is disabled because fired too early in this case
      onError: (error) => toast.error(error.message),
    }),
  );

  const linkIntegration = useMutation(trpc.integrations.link.mutationOptions());
  const setPrimaryIntegration = useMutation(
    trpc.integrations.setPrimary.mutationOptions(),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      value: "",
      service: "OPENAI",
      isPrimary: false,
    },
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const credential = await createCredential.mutateAsync({
          name: values.name,
          value: values.value,
        });

        if (!credential?.id) return;

        await linkIntegration.mutateAsync({
          service: values.service,
          credentialId: credential.id,
        });

        if (values.isPrimary) {
          await setPrimaryIntegration.mutateAsync({
            service: values.service,
            credentialId: credential.id,
          });
        }

        // Invalidate only after the full flow is done
        await queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions(),
        );
        await queryClient.invalidateQueries(
          trpc.integrations.getMany.queryOptions(),
        );
        form.reset();
        sheet.methods?.toggle?.();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    },
    [
      createCredential,
      linkIntegration,
      setPrimaryIntegration,
      queryClient,
      sheet,
      form,
    ],
  );

  return (
    <Portal container="portal-container">
      <Sheet
        sizing="large"
        closeOnInteract
        side="right"
        shortcut
        hotkey="a"
        bindkey="ctrlKey"
      >
        <ScrollArea className="h-100 w-100">
          <hgroup className="m-b-medium-30 grid g-medium-10">
            <h6>New API Key</h6>
            <p className="fs-medium-10 opacity-default-60">
              Securely store your API key for third-party integrations
            </p>
          </hgroup>

          <Banner variant="warning" className="m-b-medium-60">
            API Keys are stored encrypted and only used to securely connect with
            third-party services
          </Banner>

          <form
            className="grid w-100 m-b-large-10 g-medium-60"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Field.Root>
              <Field.Wrapper className="grid g-medium-30">
                <Field.Label className="fs-medium-20" htmlFor="credential-name">
                  API Key Name
                </Field.Label>
                <Field
                  id="credential-name"
                  autoComplete="off"
                  variant="secondary"
                  sizing="medium"
                  placeholder="e.g., OPEN_AI_RUNP_KEY"
                  style={{ width: "auto" }}
                  {...form.register("name")}
                />
                <Field.Meta variant="hint">
                  Choose a descriptive name to identify this key
                </Field.Meta>
              </Field.Wrapper>
            </Field.Root>

            <Field.Root>
              <Field.Wrapper className="grid g-medium-30">
                <Field.Label
                  className="fs-medium-20"
                  htmlFor="credential-service"
                >
                  Service
                </Field.Label>
                <Field
                  id="credential-service"
                  autoComplete="off"
                  variant="secondary"
                  sizing="medium"
                  style={{ width: "auto" }}
                  {...{ as: Select }}
                  {...form.register("service")}
                >
                  {serviceEnum.options.map((service) => (
                    <option key={service} value={service}>
                      {service.toLowerCase()}
                    </option>
                  ))}
                </Field>
              </Field.Wrapper>
            </Field.Root>

            <Field.Root>
              <Field.Wrapper className="grid g-medium-30">
                <Field.Label
                  className="fs-medium-20"
                  htmlFor="credential-value"
                >
                  API Key
                </Field.Label>
                <PrivacyField
                  id="credential-value"
                  variant="secondary"
                  sizing="medium"
                  placeholder="sk-***"
                  style={{ width: "auto" }}
                  {...form.register("value")}
                />
              </Field.Wrapper>
            </Field.Root>

            <Checkbox.Root>
              <CheckboxWrapper className="flex align-start g-medium-30">
                <div className="p-y-small-60">
                  <Checkbox
                    id="isPrimary"
                    sizing="medium"
                    variant="border"
                    onChange={(event) => {
                      form.setValue("isPrimary", Boolean(event.target.checked));
                    }}
                  >
                    <Checkbox.Indicator />
                  </Checkbox>
                </div>

                <Field.Label
                  className="grid g-medium-10 "
                  htmlFor="isPrimary"
                  optional
                >
                  <span className="fs-medium-20">Set as primary key</span>

                  <span className="fs-medium-10 opacity-default-30">
                    Primary keys will be used during workflows run instead of
                    Foudation UIs key.
                  </span>
                </Field.Label>
              </CheckboxWrapper>
            </Checkbox.Root>
          </form>

          <div className="flex align-center justify-end g-medium-10 p-b-large-10">
            <Sheet.Trigger
              variant="border"
              sizing="medium"
              onClick={() => form.reset()}
            >
              Cancel
            </Sheet.Trigger>
            <Button
              type="submit"
              variant="mono"
              sizing="medium"
              disabled={
                createCredential.isPending ||
                linkIntegration.isPending ||
                setPrimaryIntegration.isPending ||
                !form.formState.isValid
              }
              onClick={form.handleSubmit(onSubmit)}
            >
              Add
              {(createCredential.isPending ||
                linkIntegration.isPending ||
                setPrimaryIntegration.isPending) && <Spinner />}
            </Button>
          </div>
        </ScrollArea>
      </Sheet>
    </Portal>
  );
}

export default CreateCredentialDialog;
