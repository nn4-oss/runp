import "server-only";

import prisma from "@/lib/prisma";

import { inngest } from "./client";

import { Sandbox } from "@e2b/code-interpreter";
import { createNetwork, createState } from "@inngest/agent-kit";
import {
  createCodeAgent,
  createTitleAgent,
  createResponseAgent,
} from "./agents";

import { getParsedAgentOutput, getSandbox } from "./utils";
import { autoUpdateProjectTitle } from "@/services/auto-update";

import {
  SANDBOX_NAME,
  SANDBOX_PORT,
  // SANDBOX_TIMEOUT,
} from "./config/sandbox-variables";
import {
  MAX_ITERATION,
  CONTEXT_MAX_LENGTH,
  TITLE_AGENT_FALLBACK,
  RESPONSE_AGENT_FALLBACK,
} from "./config/parameters";

import type { AgentState } from "./types";
import type { Message } from "@inngest/agent-kit";

export const invokeCodeAgent = inngest.createFunction(
  { id: "runp-code-agent-invoke-function" },
  { event: "code-agent/invoke" },

  async ({ event, step }) => {
    /* Create a Sandbox Environment using the E2B NextJS Template Docker Image */
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(SANDBOX_NAME);

      /**
       * Extend the default ttl of the sandbox environment.
       * The longer it get the more credits gets spent on E2B.
       *
       * [TODO]: Add sandbox_timeout control to user's settings
       */
      // await sandbox.setTimeout(SANDBOX_TIMEOUT);

      return sandbox.sandboxId;
    });

    /** Handle Agent's Context Memory */

    /** Retrieve and store previous messages */
    const prevMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];

      // Retrieve project's existing messages
      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
        /**
         * Limit the context length to avoid hallucination on longer history.
         * `CONTEXT_MAX_LENGTH` is arbitrary, this can be challenged to improve performance and consistency.
         */
        take: CONTEXT_MAX_LENGTH,
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
      { summary: "", files: {} },
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

    /* Invole the title and response agents */
    const titleAgent = createTitleAgent();
    const responseAgent = createResponseAgent();

    /**
     * Extract title and response agents outputs,
     * do not stop the chain if those runs fails since these values have fallbacks.
     */
    const { output: title } = await titleAgent.run(result.state.data.summary);
    const { output: response } = await responseAgent.run(
      result.state.data.summary,
    );

    /* Prepare the Sandbox Environment URL that will run the code-agent output */
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(SANDBOX_PORT);

      return `https://${host}`;
    });

    const hasNoSummary = !result.state.data.summary;
    const hasNoFile = Object.keys(result.state.data.files || {}).length === 0;
    const isError = hasNoSummary || hasNoFile;

    /** Agents outputs */
    const titleContent = await getParsedAgentOutput(
      title,
      TITLE_AGENT_FALLBACK,
    );
    const summaryContent = await getParsedAgentOutput(
      response,
      RESPONSE_AGENT_FALLBACK,
    );

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

      /** Auto-update project's title after an update */
      await autoUpdateProjectTitle({
        projectId: event.data.projectId,
        title: titleContent,
      });

      /** Save user's utterance as is */
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: summaryContent,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: titleContent,
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: titleContent,
      files: result.state.data.files,
      summary: summaryContent,
    };
  },
);
