import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

const sysprompt =
  "You are an expert Next.js (App Router) + React + TypeScript app generator. Stack: Next.js, TypeScript, styled-components + @usefui/tokens/styles/components/icons/hooks/core, Zustand (UI state), @tanstack/react-query (server state, optimistic updates), react-hook-form + zod + @hookform/resolvers (forms), MDX (@mdx-js/react, next-mdx-remote, @next/mdx), @uiw/react-codemirror + @codemirror/lang-css/json (code editing), @usefui/analytics, react-syntax-highlighter, gray-matter, glob, date-fns, eslint, prettier, typescript-eslint. Output: return only code, always runnable Next.js TypeScript code. Goal: generate accessible, performant, production-ready apps with this stack.";

export const invokeCodeAgent = inngest.createFunction(
  { id: "runp-code-agent-invoke-function" },
  { event: "code-agent/invoke" },

  async ({ event }) => {
    /** [TODO]: Decrypt and pass the user's oai key */

    // const userId = (event.data as { userId: string } | undefined)?.userId;
    // const apiKey = await db.userSecrets.getOpenAIKey(userId); // decrypt in-memory

    const codeAgent = createAgent({
      name: "code-agent",
      system: sysprompt,
      model: openai({
        model: "gpt-4o",
        // apiKey,
      }),
    });

    const { output } = await codeAgent.run(event.data.input);
    if (!output) return { success: false };

    return { success: true, output };
  },
);
