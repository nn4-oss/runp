"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { DropdownMenu, Field, Switch, Tooltip } from "@usefui/components";
import { Icon, PixelIcon } from "@usefui/icons";
import { ReflectiveButton, Textarea } from "@/components";

import { toast } from "sonner";

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

const PREDEFINED_PROMPTS = [
  {
    label: "Landing Page",
    content:
      "Build a simple landing page with UX friendly interactions and advanced, mordern UI",
  },
  {
    label: "Kanban Board",
    content: "Build an animated Kanban Board using motion React dnd",
  },
  {
    label: "Music Player",
    content: "Build an animated Music Player using motion",
  },
  {
    label: "E-Commerce Page",
    content: "Build an animated E-Commerce Page using motion",
  },
  {
    label: "Split-Screen Editor",
    content: "Build an animated Split-Screen Editor using motion and React dnd",
  },
] as const;

function PromptField() {
  const router = useRouter();

  const [value, setValue] = React.useState<string>("");
  const deferredValue = React.useDeferredValue(value);

  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => router.push(`/projects/${data.id}`),
      onError: () => toast.error("An error occurred."),
    }),
  );

  return (
    <PromptContainer>
      <PromptWrapper className="p-medium-60 w-100">
        <Textarea
          autoComplete="off"
          name="prompt-field"
          placeholder="Ask Runp to build..."
          className="w-100"
          value={deferredValue}
          onChange={(event) => setValue(event.target.value)}
        />

        <div className="flex align-center justify-between">
          <div className="flex align-center g-medium-60">
            <DropdownMenu.Root>
              <Tooltip content="Prompt Tools">
                <DropdownMenu.Trigger variant="ghost">
                  <Icon>
                    <PixelIcon.Sliders />
                  </Icon>
                </DropdownMenu.Trigger>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenu.Content>
                  <DropdownMenu.Item radio>
                    <Field.Label
                      optional
                      className="flex align-center justify-between w-100 g-medium-30"
                      htmlFor="enable-graphs"
                    >
                      <span className="flex align-center g-medium-30 fs-medium-20">
                        <Icon>
                          <PixelIcon.Zap />
                        </Icon>
                        Enable Graphs
                      </span>

                      <Switch.Root>
                        <Switch name="enable-graphs" sizing="medium">
                          <Switch.Thumb />
                        </Switch>
                      </Switch.Root>
                    </Field.Label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    radio
                    disabled
                    className="flex align-center g-medium-30 "
                  >
                    <Icon>
                      <PixelIcon.Script />
                    </Icon>
                    <span className="fs-medium-20">Enhance Prompt</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </DropdownMenu.Root>
          </div>

          <div className="flex align-center g-medium-60">
            <ReflectiveButton
              sizing="small"
              variant="mono"
              onClick={() => createProject.mutate({ value })}
              disabled={createProject.isPending || deferredValue.length === 0}
              type="button"
            >
              <span className="p-y-small-30">
                <Icon>
                  <PixelIcon.ArrowRight />
                </Icon>
              </span>
            </ReflectiveButton>
          </div>
        </div>
      </PromptWrapper>

      <div className="flex flex-wrap g-medium-10 justify-center align-center">
        {PREDEFINED_PROMPTS.map((task) => (
          <ReflectiveButton
            sizing="medium"
            variant="mono"
            key={task.label}
            onClick={() => {
              setValue(task.content);
              createProject.mutate({ value: task.content });
            }}
          >
            <span className="fs-medium-10">{task.label}</span>
          </ReflectiveButton>
        ))}
      </div>
    </PromptContainer>
  );
}

export default PromptField;
