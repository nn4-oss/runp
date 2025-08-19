import { z } from "zod";
import { openai, createAgent, createTool, type Tool } from "@inngest/agent-kit";

import { agentLifecycle } from "./";
import {
  terminalAgentToolHandler,
  createUpdateAgentToolHandler,
  readFilesAgentToolHandler,
} from "../tools";

import { SYSTEM_PROMPT } from "../config/system.-prompt";
import { CODE_AGENT_PARAMETERS } from "../config/parameters";

import type { AgentState } from "../types";

export default function createCodeAgent(sandboxId: string, apiKey?: string) {
  return createAgent<AgentState>({
    name: "code-agent",
    description: "An expert coding agent",
    system: SYSTEM_PROMPT,
    model: openai({
      model: "gpt-4.1",
      defaultParameters: CODE_AGENT_PARAMETERS,
    }),
    lifecycle: {
      onResponse: async ({ result, network }) =>
        agentLifecycle({ result, network }),
    },
    tools: [
      createTool({
        name: "terminal",
        description: "Use the terminal to run commands",
        parameters: z.object({
          command: z.string(),
        }),

        handler: async ({ command }, { step }: Tool.Options<AgentState>) =>
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

        handler: async (
          { files },
          { step, network }: Tool.Options<AgentState>,
        ) => createUpdateAgentToolHandler({ files, step, network, sandboxId }),
      }),
      createTool({
        name: "readFiles",
        description: "Read files from the sandbox environment",
        parameters: z.object({
          files: z.array(z.string()),
        }),
        handler: async ({ files }, { step }: Tool.Options<AgentState>) =>
          readFilesAgentToolHandler({ files, step, sandboxId }),
      }),
    ],
  });
}
