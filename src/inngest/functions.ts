import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { getSandbox } from "./utils";
import { createCodeAgent } from "./agents";

import { SANDBOX_NAME, SANDBOX_PORT } from "./config/sandbox-variables";

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

    /* Invoke and run the code-agent using user's utterance */
    const codeAgent = createCodeAgent(sandboxId); // ,apiKey);
    const { output } = await codeAgent.run(event.data.input);

    /* Kill the agent if the output can't be generated */
    if (!output) return { success: false };

    /* Prepare the Sandbox Environment URL that will run the code-agent output */
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(SANDBOX_PORT);

      return `https://${host}`;
    });

    return { success: true, output, sandboxUrl };
  },
);
