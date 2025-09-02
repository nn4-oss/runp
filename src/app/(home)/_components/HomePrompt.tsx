"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { useKeyPress } from "@usefui/hooks";

import { Icon, PixelIcon } from "@usefui/icons";
import { PromptOptions, ReflectiveButton, Textarea } from "@/components";

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: var(--breakpoint-tablet);
  margin: 0 auto;
`;
const PromptWrapper = styled.div`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-60);

  background: var(--contrast-color);

  will-change: border-color;
  transition: border-color ease-in-out 0.2s;

  &:has(textarea:focus) {
    border-color: var(--font-color-alpha-20);
  }
`;

function HomePrompt() {
  const [value, setValue] = React.useState<string>("");
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();
  const shortcutControls = useKeyPress("Enter", true, "ctrlKey");

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        trpc.projects.getMany.queryOptions();
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        if (error?.data?.code === "UNAUTHORIZED") clerk.openSignIn();
      },
    }),
  );

  const enableShortcutSubmit =
    shortcutControls && isFocused && !createProject.isPending;

  const onSubmit = React.useCallback(async () => {
    createProject.mutate({ value });
  }, [createProject, value]);

  const onPredefinedPromptSelection = React.useCallback(
    async (content: string) => {
      setValue(content);
      createProject.mutate({ value: content });
    },
    [setValue, createProject],
  );

  React.useEffect(() => {
    if (enableShortcutSubmit) void onSubmit();
  }, [
    enableShortcutSubmit,
    shortcutControls,
    isFocused,
    createProject.isPending,
    onSubmit,
  ]);

  return (
    <PromptContainer>
      <PromptWrapper
        className="p-medium-60 w-100"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Textarea
          autoComplete="off"
          name="prompt-field"
          placeholder="Ask Runp to..."
          className="w-100"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />

        <div className="flex align-center justify-between">
          <PromptOptions />

          <div className="flex align-center g-medium-30">
            <kbd>
              <span className="fs-small-50 opacity-default-30">
                &#8963;&nbsp;+&nbsp;Enter
              </span>
            </kbd>
            <ReflectiveButton
              sizing="small"
              variant="mono"
              onClick={onSubmit}
              disabled={createProject.isPending || value.trim().length === 0}
              type="button"
            >
              <span className="p-y-small-60 flex align-center justify-center">
                <Icon>
                  <PixelIcon.ArrowRight />
                </Icon>
              </span>
            </ReflectiveButton>
          </div>
        </div>
      </PromptWrapper>
    </PromptContainer>
  );
}

export default HomePrompt;
