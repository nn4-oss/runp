"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, Spinner, Textarea } from "@/components";
import { Button, Dialog, Field, Portal, useDialog } from "@usefui/components";

import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BorderWrapper } from "@/app/settings/(general)/_components/GeneralSettings";

const formSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(400, { message: "Messages cannot exceed 400 characters" }),
});

function SendMessageDialog() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const dialog = useDialog();

  // const updateProject = useMutation(
  //   trpc.projects.update.mutationOptions({
  //     onSuccess: async () => {
  //       await queryClient.invalidateQueries(
  //         trpc.projects.getMany.queryOptions(),
  //       );
  //       await queryClient.invalidateQueries(
  //         trpc.projects.getUnique.queryOptions({ id: projectId }),
  //       );
  //       dialog.methods?.toggleDialog?.();
  //     },

  //     onError: (error) => toast.error(error.message),
  //   }),
  // );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      content:
        "Hi Runp, I'm looking to trial Runp's Enterprise product, learn about pricing, & discuss my organization's requirements with you.",
    },
  });

  // const onSubmit = React.useCallback(
  //   async (values: z.infer<typeof formSchema>) => {
  //     await updateProject.mutateAsync({
  //       id: projectId,
  //       name: values.name,
  //     });
  //   },
  //   [updateProject, projectId],
  // );

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-medium-60 grid g-medium-30">
          <h6>Contact us</h6>
        </hgroup>

        <form
          className="grid w-100 g-medium-60 m-b-large-10"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex align-center g-medium-30">
            <Field.Root>
              <Field.Wrapper className="w-100 grid g-medium-30">
                <Field.Label
                  className="opacity-default-30"
                  htmlFor="company-email"
                  optional
                >
                  Company email
                </Field.Label>
                <Field
                  id="company-email"
                  placeholder=""
                  variant="secondary"
                  style={{ width: "auto" }}
                />
              </Field.Wrapper>
            </Field.Root>
            <Field.Root>
              <Field.Wrapper className="w-100 grid g-medium-30">
                <Field.Label
                  className="opacity-default-30"
                  htmlFor="company-website"
                  optional
                >
                  Company website
                </Field.Label>
                <Field
                  id="company-website"
                  placeholder=""
                  variant="secondary"
                  style={{ width: "auto" }}
                />
              </Field.Wrapper>
            </Field.Root>
          </div>

          <Field.Root>
            <Field.Wrapper className="w-100 grid g-medium-30">
              <Field.Label
                className="opacity-default-30"
                htmlFor="author-name"
                optional
              >
                Your name
              </Field.Label>
              <Field
                id="author-name"
                placeholder=""
                variant="secondary"
                style={{ width: "auto" }}
              />
            </Field.Wrapper>
          </Field.Root>
          <Field.Root>
            <Field.Wrapper className="w-100 grid g-medium-30">
              <Field.Label
                className="opacity-default-30"
                htmlFor="message-content"
                optional
              >
                How can we help?
              </Field.Label>
              <BorderWrapper className="p-medium-30  h-100">
                <Textarea id="message-content" {...form.register("content")} />
              </BorderWrapper>
            </Field.Wrapper>
          </Field.Root>
        </form>

        <div className="flex align-center justify-end g-medium-10">
          <Dialog.Control variant="border" sizing="medium">
            Cancel
          </Dialog.Control>
          <Button
            type="submit"
            sizing="medium"
            variant="mono"
            // disabled={updateProject.isPending}
            // onClick={form.handleSubmit(onSubmit)}
          >
            Send
            {/* {updateProject.isPending && <Spinner />} */}
          </Button>
        </div>
      </Dialog>

      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default SendMessageDialog;
