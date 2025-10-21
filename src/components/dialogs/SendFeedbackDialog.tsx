"use client";

import React from "react";

import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Textarea } from "@/components";
import {
  Spinner,
  Button,
  Dialog,
  Field,
  Portal,
  useDialog,
  Card,
} from "@usefui/components";

import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(400, { message: "Messages cannot exceed 400 characters" }),
});

function SendFeedbackDialog() {
  const trpc = useTRPC();
  const dialog = useDialog();
  const queryClient = useQueryClient();

  const { data: messagesUsage } = useQuery(trpc.contact.status.queryOptions());
  const sendFeedback = useMutation(
    trpc.contact.sendFeedback.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.status.queryOptions());

        dialog.methods?.toggleDialog?.();
        form.reset();
        toast("Thank you for reaching out!");
      },
      onError: () => toast.error("Something went wrong."),
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (messagesUsage?.consumedPoints === 5) {
        toast.error("Daily limit reached.");
        throw new Error("TO_MANY_REQUESTS");
      }

      await sendFeedback.mutateAsync({
        content: values.content,
      });
    },
    [],
  );

  return (
    <Portal container="portal-container">
      <Dialog sizing="small">
        <hgroup className="m-b-large-10 grid g-medium-30">
          <h6>Give feedback</h6>
          <p className="fs-medium-20 opacity-default-60">
            Your feedback helps shape this place. We&apos;d love to hear what
            went well or how we can improve the product experience.
          </p>
        </hgroup>
        <span></span>
        <form
          className="grid w-100 g-medium-60 m-b-large-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Field.Root>
            <Field.Wrapper>
              <Card.Body className="p-medium-30">
                <Textarea
                  id="message-content"
                  style={{ height: "var(--measurement-large-60)" }}
                  placeholder="Your feedback.."
                  {...form.register("content")}
                />
              </Card.Body>
              <Field.Meta variant="hint">Feedbacks are anonymous</Field.Meta>
            </Field.Wrapper>
          </Field.Root>
        </form>
        <footer className="flex align-center justify-end g-medium-10">
          <Dialog.Control
            variant="secondary"
            sizing="medium"
            animation="reflective"
          >
            Cancel
          </Dialog.Control>
          <Button
            type="submit"
            sizing="medium"
            variant="primary"
            disabled={sendFeedback.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Send
            {sendFeedback.isPending && <Spinner />}
          </Button>
        </footer>
      </Dialog>
      <Dialog.Overlay closeOnInteract />
    </Portal>
  );
}

export default SendFeedbackDialog;
