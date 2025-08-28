"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { Icon, PixelIcon } from "@usefui/icons";
import { PromptOptions, ReflectiveButton, Textarea } from "@/components";

import { toast } from "sonner";
import { useKeyPress } from "@usefui/hooks";

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const PromptWrapper = styled.div`
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-60);

  max-width: var(--breakpoint-tablet);
  margin: var(--measurement-large-20) auto var(--measurement-medium-60) auto;

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
  const shortcutControls = useKeyPress("Enter", true, "ctrlKey");

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => router.push(`/projects/${data.id}`),
      onError: () => toast.error("An error occurred."),
    }),
  );

  const enableShortcutSubmit =
    shortcutControls && isFocused && !createProject.isPending;
  const onSubmit = async () => createProject.mutate({ value });

  React.useEffect(() => {
    if (enableShortcutSubmit) void onSubmit();
  }, [shortcutControls, isFocused, createProject.isPending, onSubmit]);

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
          placeholder="Ask Runp to build..."
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
