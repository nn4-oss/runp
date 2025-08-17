import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { openai, createAgent, createTool } from "@inngest/agent-kit";

import { z } from "zod";
import { getSandbox } from "./utils";

import {
  terminalAgentToolHandler,
  createUpdateAgentToolHandler,
  readFilesAgentToolHandler,
} from "./tools";

import { SYSTEM_PROMPT } from "./config/system.-prompt";
import { SANDBOX_NAME, SANDBOX_PORT } from "./config/sandbox-variables";

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
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),

          handler: async ({ command }, { step }) =>
            terminalAgentToolHandler({ command, step, sandboxId }),
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox environment",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),

          handler: async ({ files }, { step, network }) =>
            createUpdateAgentToolHandler({ files, step, network, sandboxId }),
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox environment",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) =>
            readFilesAgentToolHandler({ files, step, sandboxId }),
        }),
      ],
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
