import { getLastMessageContent } from "../utils";
import type { AgentResult, NetworkRun, StateData } from "@inngest/agent-kit";

type AgentLifeCycle = {
  result: AgentResult;
  network: NetworkRun<StateData> | undefined;
};

export default async function agentLifecycle({
  result,
  network,
}: AgentLifeCycle) {
  const lastAssistantMessage = await getLastMessageContent(result);

  /**
   * Extract and parse the last assistant message;
   * If the result includes the task_summary tag, store it in the network summary;
   * Otherwise return the result and let the lifecycle of the function continue.
   */
  if (lastAssistantMessage && network) {
    if (lastAssistantMessage.includes("<task_summary>")) {
      network.state.data.summary = lastAssistantMessage;
    }
  }

  return result;
}
