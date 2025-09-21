import { openai, createAgent } from "@inngest/agent-kit";

import { RESPONSE_PROMPT } from "../prompts/response-prompt";
import { RESPONSE_AGENT_PARAMETERS } from "../config/parameters";

import type { AgentState } from "../types";

export default function createResponseAgent(apiKey?: string) {
  return createAgent<AgentState>({
    name: "response-agent",
    description: "A response generator agent",
    system: RESPONSE_PROMPT,
    model: openai({
      model: "gpt-4o",
      defaultParameters: RESPONSE_AGENT_PARAMETERS,
      apiKey,
    }),
  });
}
