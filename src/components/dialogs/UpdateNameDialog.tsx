"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Button,
  Dialog,
  Field,
  Portal,
  useDialog,
  Spinner,
} from "@usefui/components";

import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(128, { message: `Name cannot exceed 128 chars` }),
});

function UpdateNameDialog({
  currentName,
  projectId,
}: {
  currentName: string;
  projectId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const dialog = useDialog();

  const updateProject = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.projects.getMany.queryOptions(),
        );
        await queryClient.invalidateQueries(
          trpc.projects.getUnique.queryOptions({ id: projectId }),
        );
        dialog.methods?.toggleDialog?.();
      },

      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { name: currentName },
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      await updateProject.mutateAsync({
        id: projectId,
        name: values.name,
      });
    },
    [updateProject, projectId],
  );

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-medium-60 grid g-medium-30">
          <h6>Rename project</h6>
        </hgroup>

        <form
          className="flex w-100 m-b-large-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Field.Root>
            <Field
              variant="secondary"
              sizing="large"
              style={{ width: "100%" }}
              {...form.register("name")}
            />
          </Field.Root>
        </form>

        <div className="flex align-center justify-end g-medium-10">
          <Dialog.Control
            variant="border"
            sizing="medium"
            animation="reflective"
          >
            Cancel
          </Dialog.Control>
          <Button
            type="submit"
            sizing="medium"
            variant="mono"
            animation="reflective"
            disabled={updateProject.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
            {updateProject.isPending && <Spinner />}
          </Button>
        </div>
      </Dialog>

      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default UpdateNameDialog;
