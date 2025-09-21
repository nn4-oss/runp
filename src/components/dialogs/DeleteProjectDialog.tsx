"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button, Dialog, useDialog, Portal } from "@usefui/components";

import { toast } from "sonner";
import { Spinner } from "@/components";

const DangerButton = styled(Button)`
  background-color: var(--color-red) !important;

  span {
    color: white !important;
  }
`;

function DeleteProjectDialog({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dialog = useDialog();

  const deleteProject = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.projects.getMany.queryOptions(),
        );
        router.push("/projects");
      },
      onSettled: () => dialog.methods?.toggleDialog?.(),
      onError: (error) => toast.error(error.message),
    }),
  );

  const onDelete = React.useCallback(async () => {
    await deleteProject.mutateAsync({
      id: projectId,
    });
  }, []);

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-large-10 grid g-medium-30">
          <h6>Delete project?</h6>
          <p className="fs-medium-20 opacity-default-60">
            This project will be moved to your archive. Archives are permanently
            deleted and cannot be retrieved.
          </p>
        </hgroup>
        <div className="flex align-center justify-end g-medium-10">
          <Dialog.Control variant="border" sizing="medium">
            Cancel
          </Dialog.Control>
          <DangerButton
            sizing="medium"
            disabled={deleteProject.isPending}
            onClick={() => onDelete()}
          >
            <span>Delete</span>
            {deleteProject.isPending && <Spinner />}
          </DangerButton>
        </div>
      </Dialog>

      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default DeleteProjectDialog;
