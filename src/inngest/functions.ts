import prisma from "@/lib/prisma";

import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { getSandbox } from "./utils";

import { createNetwork, createState } from "@inngest/agent-kit";
import { createCodeAgent } from "./agents";

import { SANDBOX_NAME, SANDBOX_PORT } from "./config/sandbox-variables";
import { MAX_ITERATION } from "./config/parameters";

import type { AgentState } from "./types";
import type { Message } from "@inngest/agent-kit";

export const invokeCodeAgent = inngest.createFunction(
  { id: "runp-code-agent-invoke-function" },
  { event: "code-agent/invoke" },

  async ({ event, step }) => {
    /* Create a Sandbox Environment using the E2B NextJS Template Docker Image */
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(SANDBOX_NAME);
      return sandbox.sandboxId;
    });

    /** Handle Agent's Context Memory */

    /** Retrieve and store previous messages */
    const prevMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];

      // Retrieve project existing messages
      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.prodjectId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Push each message to formattedMessages
      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        });
      }

      return formattedMessages;
    });

    /** Create agent state with previous messages context */
    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      { messages: prevMessages },
    );

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
      defaultState: state, // Load previous messages context as default state
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        /** Kill the loop if a summary had been generated, call the agent otherwise */
        if (summary) return;
        return codeAgent;
      },
    });

    /* Run the code-agent using user's utterance, load previous messages context state */
    const result = await network.run(event.data.input, { state });

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
            projectId: event.data.projectId,
            content: "Something went wrong, please try again.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      /** Save user's utterance as is */
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
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
