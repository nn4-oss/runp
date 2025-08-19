import prisma from "@/lib/prisma";

import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { getSandbox } from "./utils";

import { createNetwork } from "@inngest/agent-kit";
import { createCodeAgent } from "./agents";

import { SANDBOX_NAME, SANDBOX_PORT } from "./config/sandbox-variables";
import { MAX_ITERATION } from "./config/parameters";

import type { AgentState } from "./types";

export const invokeCodeAgent = inngest.createFunction(
  { id: "runp-code-agent-invoke-function" },
  { event: "code-agent/invoke" },

  async ({ event, step }) => {
    /* Create a Sandbox Environment using the E2B NextJS Template Docker Image */
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(SANDBOX_NAME);
      return sandbox.sandboxId;
    });

    /* [TODO]: Decrypt and pass the user's oai key */
    // const userId = (event.data as { userId: string } | undefined)?.userId;
    // const apiKey = await db.userSecrets.getOpenAIKey(userId); // decrypt in-memory

    /* Invoke the code-agent */
    const codeAgent = createCodeAgent(sandboxId); // ,apiKey);

    /* Setup and add codeAgent to the inngest network */
    const network = createNetwork<AgentState>({
      name: "runp-code-agent",
      agents: [codeAgent],
      maxIter: MAX_ITERATION, // Limit how many loops the agent can perform
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        /** Kill the loop if a summary had been generated, call the agent otherwise */
        if (summary) return;
        return codeAgent;
      },
    });

    /* Run the code-agent using user's utterance */
    const result = await network.run(event.data.input);

    /* Prepare the Sandbox Environment URL that will run the code-agent output */
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(SANDBOX_PORT);

      return `https://${host}`;
    });

    const hasNoSummary = !result.state.data.summary;
    const hasNoFile = Object.keys(result.state.data.files || {}).length === 0;
    const isError = hasNoSummary || hasNoFile;

    /** Save Result in DB when the agent job is completed */
    await step.run("save-result", async () => {
      /** Save as error if no summary/files are defined */
      if (isError) {
        return await prisma.message.create({
          data: {
            content: "Something went wrong, please try again.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      /** Save user's utterance as is */
      return await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: "Fragment",
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
