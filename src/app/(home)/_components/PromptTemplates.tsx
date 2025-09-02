"use client";

import React from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";

import { ReflectiveButton } from "@/components";

import { PREDEFINED_FEATURES_PROMPTS } from "../_prompts/predefined-features-prompts";

const TemplatesContainer = styled.div`
  max-width: var(--breakpoint-desktop-small);
  margin: 0 auto;
`;

function PromptTemplates() {
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();

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

  const onPredefinedPromptSelection = React.useCallback(
    async (content: string) => {
      createProject.mutate({ value: content });
    },
    [createProject],
  );

  return (
    <TemplatesContainer>
      <hgroup className="m-b-medium-60">
        <h6>Templates</h6>
        <p className="fs-medium-10 opacity-default-60">
          Use prompt templates to build your next features.
        </p>
      </hgroup>

      <div className="flex flex-wrap g-medium-10 align-center">
        {PREDEFINED_FEATURES_PROMPTS.map((task) => (
          <ReflectiveButton
            sizing="medium"
            variant="border"
            key={task.label}
            onClick={() => onPredefinedPromptSelection(task.content)}
          >
            <span className="fs-medium-10">{task.label}</span>
          </ReflectiveButton>
        ))}
      </div>
    </TemplatesContainer>
  );
}

export default PromptTemplates;
