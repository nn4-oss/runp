"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button, Spinner, Dialog, Portal, useDialog } from "@usefui/components";

import { toast } from "sonner";

function DeleteCredentialDialog({
  credentialName,
}: {
  credentialName: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const dialog = useDialog();

  const deleteCredential = useMutation(
    trpc.credentials.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions(),
        );
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(
          trpc.integrations.getMany.queryOptions(),
        );
        dialog.methods?.toggleDialog?.();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const onDelete = React.useCallback(async () => {
    await deleteCredential.mutateAsync({
      name: credentialName,
    });
  }, []);

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-large-10 grid g-medium-30">
          <h6>Delete API Key?</h6>
          <p className="fs-medium-20 opacity-default-60">
            This API Key will be moved to your archive. Archives are permanently
            deleted and cannot be retrieved.
          </p>
        </hgroup>
        <div className="flex align-center justify-end g-medium-10">
          <Dialog.Control
            variant="secondary"
            sizing="medium"
            animation="reflective"
          >
            Cancel
          </Dialog.Control>
          <Button
            variant="danger"
            sizing="medium"
            disabled={deleteCredential.isPending}
            onClick={() => onDelete()}
          >
            <span>Delete</span>
            {deleteCredential.isPending && <Spinner />}
          </Button>
        </div>
      </Dialog>

      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default DeleteCredentialDialog;
