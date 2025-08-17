import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

import { getSandbox } from "./utils";

const SANDBOX_NAME = "runp-test-dev"; // SANDBOX_NAME relates to the E2B docker image's name, they MUST match
const SANDBOX_PORT = 3000; // nextjs sandbox template port
const SYSTEM_PROMPT =
  "You are an expert Next.js (App Router) + React + TypeScript app generator. Stack: Next.js, TypeScript, styled-components + @usefui/tokens/styles/components/icons/hooks/core, Zustand (UI state), @tanstack/react-query (server state, optimistic updates), react-hook-form + zod + @hookform/resolvers (forms), MDX (@mdx-js/react, next-mdx-remote, @next/mdx), @uiw/react-codemirror + @codemirror/lang-css/json (code editing), @usefui/analytics, react-syntax-highlighter, gray-matter, glob, date-fns, eslint, prettier, typescript-eslint. Output: return only code, always runnable Next.js TypeScript code. Goal: generate accessible, performant, production-ready apps with this stack.";

export const invokeCodeAgent = inngest.createFunction(
  { id: "runp-code-agent-invoke-function" },
  { event: "code-agent/invoke" },

  async ({ event, step }) => {
    /**
     * Create a Sandbox Environment using the E2B NextJS Template Docker Image,
     */
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(SANDBOX_NAME);
      return sandbox.sandboxId;
    });

    /**
     * Run the code-agent using user's utterance;
     * [TODO]: Decrypt and pass the user's oai key */

    // const userId = (event.data as { userId: string } | undefined)?.userId;
    // const apiKey = await db.userSecrets.getOpenAIKey(userId); // decrypt in-memory

    const codeAgent = createAgent({
      name: "code-agent",
      system: SYSTEM_PROMPT,
      model: openai({
        model: "gpt-4o",
        // apiKey,
      }),
    });

    const { output } = await codeAgent.run(event.data.input);
    if (!output) return { success: false };

    /**
     * Prepare the Sandbox Environment URL that will run the code-agent output
     */
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(SANDBOX_PORT);

      return `https://${host}`;
    });

    return { success: true, output, sandboxUrl };
  },
);
