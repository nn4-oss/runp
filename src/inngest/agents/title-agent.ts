import { openai, createAgent } from "@inngest/agent-kit";

import { TITLE_PROMPT } from "../prompts/title-prompt";
import { TITLE_AGENT_PARAMETERS } from "../config/parameters";

import type { AgentState } from "../types";

export default function createTitleAgent(_apiKey?: string) {
  return createAgent<AgentState>({
    name: "title-agent",
    description: "A title generator agent",
    system: TITLE_PROMPT,
    model: openai({
      model: "gpt-4o",
      defaultParameters: TITLE_AGENT_PARAMETERS,
    }),
  });
}
