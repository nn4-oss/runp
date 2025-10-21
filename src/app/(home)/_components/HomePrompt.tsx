"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useKeyPress } from "@usefui/hooks";
import { useForm } from "react-hook-form";
import { useColorMode } from "@usefui/tokens";

import Link from "next/link";
import PromptTemplates from "./PromptTemplates";

import { Icon, PixelIcon } from "@usefui/icons";
import { Button, Spinner } from "@usefui/components";
import { PromptOptions, Textarea } from "@/components";

import { PulsingBorder } from "@paper-design/shaders-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { utteranceValueSchema } from "@/schemas/utterances-schema";

const PromptContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: var(--breakpoint-tablet-small);
  margin: 0 auto;
  z-index: var(--depth-default-10);
`;
const PromptWrapper = styled.form`
  z-index: 90;
  position: relative;
  border: var(--measurement-small-30) solid var(--font-color-alpha-10);
  border-radius: var(--measurement-medium-60);

  background: var(--contrast-color);

  will-change: border-color;
  transition: border-color ease-in-out 0.2s;

  &:has(textarea:focus) {
    border-color: var(--font-color-alpha-20);
  }
`;
const ProBanner = styled.div`
  --pos-y: calc((var(--measurement-large-30) / 2) * -1);

  @keyframes fadeIn {
    0% {
      transform: translateY(calc((var(--measurement-large-30) * 2.5) * -1));
      opacity: 0;
    }
    100% {
      transform: translateY(var(--pos-y));
      opacity: 1;
    }
  }

  background-color: var(--font-color-alpha-10);
  border-bottom-left-radius: var(--measurement-medium-40);
  border-bottom-right-radius: var(--measurement-medium-40);
  padding: var(--measurement-medium-30) var(--measurement-medium-50);
  height: var(--measurement-large-30);
  width: 100%;

  transform: translateY(var(--pos-y));
  animation: fadeIn 1s cubic-bezier(0.075, 0.82, 0.165, 1);

  z-index: 10;
`;
const ShaderBackground = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: none;
`;

const formSchema = z.object({
  content: utteranceValueSchema,
});

function HomePrompt() {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [showUsage, setShowUsage] = React.useState<boolean>(true);

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const shortcutControls = useKeyPress("Enter", true, "ctrlKey");
  const { colorMode } = useColorMode();

  const { data: user } = useQuery(trpc.user.get.queryOptions());
  const { data: config } = useQuery(
    trpc.configuration.getLatestVersion.queryOptions(),
  );
  const { data: integrations } = useQuery(
    trpc.integrations.getMany.queryOptions(),
  );

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

  const isProScope = user?.scope === "PRO";
  const showProBanner = isProScope && showUsage && integrations;
  const hasOpenAiAPIKeyDefined = integrations?.some((integration) => {
    return integration.service === "OPENAI";
  });

  const shaderColors = React.useMemo(() => {
    return [
      "rgba(255, 255, 255, 1)",
      "rgba(255, 255, 255, 0.1)",
      "rgba(255, 255, 255, 0.2)",
      "rgba(255, 255, 255, 0.3)",
      "rgba(255, 255, 255, 0.4)",
    ];
    // return (["dark", "system"] as (typeof colorMode)[]).includes(colorMode)
    //   ? [
    //       "rgba(255, 255, 255, 1)",
    //       "rgba(255, 255, 255, 0.1)",
    //       "rgba(255, 255, 255, 0.2)",
    //       "rgba(255, 255, 255, 0.3)",
    //       "rgba(255, 255, 255, 0.4)",
    //     ]
    //   : [
    //       "rgba(255, 255, 255, 1)",
    //       "rgba(255, 127, 17, 0.1)",
    //       "rgba(255, 127, 17, 0.2)",
    //       "rgba(255, 127, 17, 0.3)",
    //       "rgba(255, 127, 17, 0.4)",
    //     ];
  }, [colorMode]);

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      await createProject.mutateAsync({
        value: values.content,
        config: {
          diagrams: Boolean(config?.diagrams),
          additionalPrompt: config?.additionalPrompt ?? "",
        },
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
        className="w-100"
        onSubmit={form.handleSubmit(onSubmit)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <ShaderBackground
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 0 : 1 }}
          transition={{
            duration: 2,
          }}
        >
          <PulsingBorder
            style={{ height: "146.5%", minWidth: "143%" }}
            colorBack="rgba(0, 0, 0, 0)"
            roundness={0.18}
            thickness={0}
            softness={1}
            intensity={0.3}
            bloom={2}
            spots={1}
            spotSize={0.25}
            pulse={0}
            smoke={0.35}
            smokeSize={0.4}
            scale={0.7}
            rotation={Math.PI / 10}
            offsetX={0}
            offsetY={0}
            speed={Math.PI / 10}
            colors={shaderColors}
          />
        </ShaderBackground>
        <div className="p-medium-60">
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
                  Ctrl&nbsp;+&nbsp;Enter
                </span>
              </kbd>

              <Button
                type="submit"
                sizing="small"
                variant="mono"
                shape="round"
                animation="reflective"
                onClick={form.handleSubmit(onSubmit)}
                disabled={createProject.isPending || !form.formState.isValid}
              >
                <span className="p-y-small-60 flex align-center justify-center">
                  {createProject.isPending ? (
                    <Spinner />
                  ) : (
                    <Icon>
                      <PixelIcon.ArrowUp />
                    </Icon>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </PromptWrapper>

      {showProBanner && !hasOpenAiAPIKeyDefined && (
        <ProBanner className="flex align-end justify-between">
          <span className="fs-medium-10 opacity-default-60 flex align-center g-medium-10">
            <Icon>
              <PixelIcon.Lock />
            </Icon>
            <Link href="/settings/api-keys">Define and link</Link>
            your own
            <Link href="https://platform.openai.com/api-keys" target="_blank">
              OpenAI
            </Link>
            API key to your project.
          </span>

          <Button
            sizing="small"
            variant="ghost"
            onClick={() => setShowUsage(false)}
          >
            <Icon>
              <PixelIcon.Close />
            </Icon>
          </Button>
        </ProBanner>
      )}

      <span
        className={
          showProBanner && !hasOpenAiAPIKeyDefined ? "" : "m-t-medium-60"
        }
      >
        <PromptTemplates />
      </span>
    </PromptContainer>
  );
}

export default HomePrompt;
