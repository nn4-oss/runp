"use client";

import React from "react";
import styled from "styled-components";

import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { useKeyPress } from "@usefui/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PromptOptions,
  ReflectiveButton,
  Spinner,
  Textarea,
} from "@/components";
import { Icon, PixelIcon } from "@usefui/icons";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";

import { toast } from "sonner";

const PromptWrapper = styled.form`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-30);

  background: var(--contrast-color);
  box-shadow: 0 calc(var(--measurement-medium-50) * -1)
    var(--measurement-medium-50) 0 var(--body-color);

  will-change: border-color;
  transition: border-color ease-in-out 0.2s;

  z-index: var(--depth-default-100);
  &:has(textarea:focus) {
    border-color: var(--font-color-alpha-20);
  }
`;

const formSchema = z.object({
  value: utteranceValueSchema,
});

function MessagesPrompt({ projectId }: { projectId: string }) {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const shortcutControls = useKeyPress("Enter", true, "ctrlKey");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: async () => {
        form.reset();

        await queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId }),
        );
      },

      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      value: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      projectId,
      value: values.value,
    });
  };

  React.useEffect(() => {
    const enableShortcutSubmit =
      shortcutControls &&
      isFocused &&
      form.formState.isValid &&
      !createMessage.isPending;
    if (enableShortcutSubmit) {
      // Use RHF's handleSubmit to re-run validation before submit.
      void form.handleSubmit(onSubmit)();
    }
    // Re-run when key state toggles or guard inputs change.
  }, [
    shortcutControls,
    isFocused,
    form.formState.isValid,
    createMessage.isPending,
    form,
    onSubmit,
  ]);

  return (
    <PromptWrapper
      id="prompt-form"
      name="prompt-form"
      className="grid align-end w-100 p-medium-30"
      onSubmit={form.handleSubmit(onSubmit)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Textarea
        id="prompt-content"
        placeholder="Ask a follow up.."
        className="p-b-large-10"
        disabled={createMessage.isPending}
        {...form.register("value")}
      />

      <div className="flex justify-between align-center g-medium-30">
        <PromptOptions />

        <div className="flex align-center g-medium-30">
          <kbd>
            <span className="fs-small-50 opacity-default-30">
              &#8963;&nbsp;+&nbsp;Enter
            </span>
          </kbd>

          <ReflectiveButton
            type="submit"
            sizing="small"
            variant="mono"
            disabled={createMessage.isPending || !form.formState.isValid}
          >
            <span className="p-y-small-30">
              {createMessage.isPending ? (
                <Spinner />
              ) : (
                <Icon>
                  <PixelIcon.ArrowRight />
                </Icon>
              )}
            </span>
          </ReflectiveButton>
        </div>
      </div>
    </PromptWrapper>
  );
}

export default MessagesPrompt;
