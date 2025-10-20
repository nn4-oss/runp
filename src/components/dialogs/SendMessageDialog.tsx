"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Textarea, BorderWrapper } from "@/components";
import {
  Spinner,
  Button,
  Dialog,
  Field,
  Portal,
  useDialog,
} from "@usefui/components";

import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  subject: z.string().trim().min(1, { message: "Content is required" }),
  content: z
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(400, { message: "Messages cannot exceed 400 characters" }),
});

function SendMessageDialog() {
  const trpc = useTRPC();
  const dialog = useDialog();

  const { data: user } = useQuery(trpc.user.get.queryOptions());
  const sendContactRequest = useMutation(
    trpc.contact.sendRequest.mutationOptions({
      onSuccess: async () => {
        dialog.methods?.toggleDialog?.();
        form.reset();
        toast("Thank you for reaching out!", {
          description:
            "A member of the team will contact you as soon as possible.",
        });
      },

      onError: () => toast.error("Something went wrong."),
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      subject: user?.email ?? "",
      content:
        "Hi! I'm looking to trial Runp's Enterprise product, learn about pricing, & discuss my organization's requirements with you.",
    },
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      await sendContactRequest.mutateAsync({
        subject: values.subject,
        content: values.content,
      });
    },
    [],
  );

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-large-10 grid g-medium-30">
          <h6>Get an Enterprise trial of Runp.</h6>
          <p className="fs-medium-20 opacity-default-60">
            Let&apos;s meet to talk about the value of Runp and Foundation UI
            for your enterprise.
          </p>
        </hgroup>

        <form
          className="grid w-100 g-medium-60 m-b-large-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Field.Root>
            <Field.Wrapper className="w-100 ">
              <Field.Label
                className="fs-medium-10 m-b-medium-30"
                htmlFor="contact-email"
                optional
              >
                Contact email
              </Field.Label>
              <Field
                id="contact-email"
                placeholder=""
                type="email"
                variant="secondary"
                style={{ width: "auto" }}
                {...form.register("subject")}
              />
              <Field.Meta variant="hint">
                This email will not be saved.
              </Field.Meta>
            </Field.Wrapper>
          </Field.Root>

          <Field.Root>
            <Field.Wrapper>
              <Field.Label
                className="fs-medium-10 m-b-medium-30"
                htmlFor="message-content"
                optional
              >
                How can we help?
              </Field.Label>
              <BorderWrapper className="p-medium-30  ">
                <Textarea
                  id="message-content"
                  style={{ height: "var(--measurement-large-60)" }}
                  {...form.register("content")}
                />
              </BorderWrapper>
            </Field.Wrapper>
          </Field.Root>
        </form>

        <footer className="flex align-center justify-end g-medium-10">
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
            disabled={sendContactRequest.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Send
            {sendContactRequest.isPending && <Spinner />}
          </Button>
        </footer>
      </Dialog>
      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default SendMessageDialog;
