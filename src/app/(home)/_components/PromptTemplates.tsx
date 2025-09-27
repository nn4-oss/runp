"use client";

import React from "react";
import styled from "styled-components";

import { motion, type Variants } from "framer-motion";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";

import { ReflectiveButton } from "@/components";

import { PREDEFINED_FEATURES_PROMPTS } from "../_prompts/predefined-features-prompts";
import { toast } from "sonner";

const TemplatesContainer = styled(motion.div)<{ variants?: Variants }>`
  max-width: var(--breakpoint-tablet-small);
  margin: 0 auto;
`;

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};
const slide: Variants = {
  hidden: {
    opacity: 0,
    y: -3,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function PromptTemplates() {
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();

  const { data: config } = useQuery(
    trpc.configuration.getLatestVersion.queryOptions(),
  );

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        trpc.projects.getMany.queryOptions();
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        if (error?.data?.code === "UNAUTHORIZED") clerk.openSignIn();
        toast("Something went wrong", {
          description:
            "Check your credits or contact support if you believe this is an error.",
        });
      },
    }),
  );

  const onPredefinedPromptSelection = React.useCallback(
    async (content: string) => {
      createProject.mutate({
        value: content,
        config: {
          diagrams: Boolean(config?.diagrams),
          additionalPrompt: config?.additionalPrompt ?? "",
        },
      });
    },
    [createProject],
  );

  return (
    <TemplatesContainer
      className="flex flex-wrap g-medium-10 align-center justify-center "
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {PREDEFINED_FEATURES_PROMPTS.map((task) => (
        <motion.span key={task.label} variants={slide}>
          <ReflectiveButton
            sizing="medium"
            variant="border"
            disabled={createProject.isPending}
            onClick={() => onPredefinedPromptSelection(task.content)}
          >
            <span className="fs-medium-10">{task.label}</span>
          </ReflectiveButton>
        </motion.span>
      ))}
    </TemplatesContainer>
  );
}

export default PromptTemplates;
