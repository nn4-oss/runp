"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
  Button,
  Checkbox,
  Dialog,
  Field,
  Portal,
  useDialog,
} from "@usefui/components";
import { Spinner } from "@/components";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().max(128, { message: "Name cannot exceed 128 characters" }),
  isPrimary: z.boolean().default(false),
});

function UpdateCredentialDialog({ credentialId }: { credentialId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const dialog = useDialog();

  const { data: integrations } = useSuspenseQuery(
    trpc.integrations.getMany.queryOptions(),
  );

  const targetIntegrationMetadata = React.useMemo(() => {
    return integrations.find((int) => int.credentialId === credentialId);
  }, [integrations, credentialId]);

  const updateCredential = useMutation(
    trpc.credentials.update.mutationOptions({
      // Invalidation has to be made after every queries and mutation are done.
      onError: (error) => toast.error(error.message),
    }),
  );

  const setPrimaryIntegration = useMutation(
    trpc.integrations.setPrimary.mutationOptions(),
  );
  const resetPrimaryIntegration = useMutation(
    trpc.integrations.resetPrimary.mutationOptions(),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: targetIntegrationMetadata?.credential.name ?? "",
      isPrimary: targetIntegrationMetadata?.isPrimary ?? false,
    },
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (targetIntegrationMetadata) {
        try {
          const credential = await updateCredential.mutateAsync({
            id: targetIntegrationMetadata.credentialId,
            name: values.name,
            // value: values.value,
          });

          if (!credential?.id) return;

          if (values.isPrimary === true) {
            await setPrimaryIntegration.mutateAsync({
              service: targetIntegrationMetadata?.service,
              credentialId: credential.id,
            });
          }
          if (values.isPrimary === false) {
            await resetPrimaryIntegration.mutateAsync({
              service: targetIntegrationMetadata?.service,
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
          dialog.methods?.toggleDialog?.();
        } catch (err: any) {
          toast.error(err.message || "Something went wrong");
        }
      }
    },
    [setPrimaryIntegration, queryClient, dialog, form],
  );

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-large-10 grid g-medium-30">
          <h6>Update API Key</h6>
        </hgroup>

        <form
          className="grid w-100 m-b-large-10 g-medium-60"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Field.Root>
            <Field.Wrapper className="grid g-medium-30">
              <Field.Label
                className="fs-medium-20"
                htmlFor="credential-name"
                optional
              >
                Name
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
            </Field.Wrapper>
          </Field.Root>

          <Checkbox.Root>
            <Field.Wrapper className="flex align-start g-medium-30">
              <div className="p-y-small-60">
                <Checkbox
                  id="isPrimary"
                  sizing="medium"
                  variant="border"
                  defaultChecked={form.watch("isPrimary")}
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
                <span className="fs-medium-20">Primary key</span>

                <span className="fs-medium-10 opacity-default-30">
                  Primary keys will be used during workflows run instead of
                  Foudation UIs key.
                </span>
              </Field.Label>
            </Field.Wrapper>
          </Checkbox.Root>
        </form>

        <div className="flex align-center justify-end g-medium-10">
          <Dialog.Control variant="border" sizing="medium">
            Cancel
          </Dialog.Control>
          <Button
            type="submit"
            sizing="medium"
            variant="mono"
            disabled={
              updateCredential.isPending || setPrimaryIntegration.isPending
            }
            onClick={form.handleSubmit(onSubmit)}
          >
            <span>Update</span>
            {(updateCredential.isPending ||
              setPrimaryIntegration.isPending) && <Spinner />}
          </Button>
        </div>
      </Dialog>

      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default UpdateCredentialDialog;
