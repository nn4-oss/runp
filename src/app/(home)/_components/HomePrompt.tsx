"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useKeyPress } from "@usefui/hooks";
import { useForm } from "react-hook-form";

import { Icon, PixelIcon } from "@usefui/icons";
import {
  PromptOptions,
  ReflectiveButton,
  Spinner,
  Textarea,
  UsageBanner,
} from "@/components";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";

import { toast } from "sonner";

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: var(--breakpoint-tablet);
  margin: 0 auto;
`;
const PromptWrapper = styled.form`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-60);

  background: var(--contrast-color);

  will-change: border-color;
  transition: border-color ease-in-out 0.2s;

  &:has(textarea:focus) {
    border-color: var(--font-color-alpha-20);
  }
`;

const formSchema = z.object({
  content: utteranceValueSchema,
});

function HomePrompt() {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [showUsage, setShowUsage] = React.useState<boolean>(false);

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const shortcutControls = useKeyPress("Enter", true, "metaKey");

  const { data: user } = useQuery(trpc.user.get.queryOptions());
  const { data: usage } = useQuery(trpc.usage.status.queryOptions());
  const showUsageBanner = !!usage && showUsage;

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: async (data) => {
        form.reset();

        trpc.projects.getMany.queryOptions();
        await queryClient.invalidateQueries(trpc.usage.status.queryOptions());
        await queryClient.invalidateQueries(
          trpc.usage.getMetadata.queryOptions(),
        );

        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        if (error?.data?.code === "UNAUTHORIZED") {
          router.push("/signup");
        }
        if (error.data?.code === "TOO_MANY_REQUESTS") {
          setShowUsage(true);
          // toast.error("Rate limit exceeded");
        }
      },
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
      await createProject.mutateAsync({
        value: values.content,
      });
    },
    [createProject],
  );

  React.useEffect(() => {
    const enableShortcutSubmit =
      shortcutControls &&
      isFocused &&
      form.formState.isValid &&
      !createProject.isPending;
    if (enableShortcutSubmit) {
      // Use RHF's handleSubmit to re-run validation before submit.
      void form.handleSubmit(onSubmit)();
    }
    // Re-run when shortcutControls fires.
  }, [shortcutControls]);

  return (
    <PromptContainer>
      <PromptWrapper
        className="p-medium-60 w-100"
        onSubmit={form.handleSubmit(onSubmit)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Textarea
          autoComplete="off"
          id="prompt-content"
          placeholder="Ask runp to build.."
          className="p-b-large-10"
          disabled={createProject.isPending}
          {...form.register("content")}
        />

        <div className="flex align-center justify-between">
          <PromptOptions />

          <div className="flex align-center g-medium-30">
            <kbd>
              <span className="fs-small-50 opacity-default-30">
                &#8984;&nbsp;+&nbsp;Enter
              </span>
            </kbd>

            <ReflectiveButton
              type="submit"
              sizing="small"
              variant="mono"
              onClick={form.handleSubmit(onSubmit)}
              disabled={createProject.isPending || !form.formState.isValid}
            >
              <span className="p-y-small-30">
                {createProject.isPending ? (
                  <Spinner />
                ) : (
                  <Icon>
                    <PixelIcon.ArrowUp />
                  </Icon>
                )}
              </span>
            </ReflectiveButton>
          </div>
        </div>
      </PromptWrapper>
      {showUsageBanner && (
        <div className="m-y-medium-30 w-100">
          <UsageBanner
            scope={user?.scope ?? "FREE"}
            points={usage.remainingPoints}
            beforeNext={usage.msBeforeNext}
          />
        </div>
      )}
    </PromptContainer>
  );
}

export default HomePrompt;
