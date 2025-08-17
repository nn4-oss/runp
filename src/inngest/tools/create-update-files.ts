import { getSandbox } from "../utils";
import type { NetworkRun, StateData } from "@inngest/agent-kit";

/**
 * Get the updated list of files array;
 * Connect to the sandbox environment;
 * For each entry in the updated files array, create/update it in the sandbox environment;
 * This enable the model to create/update the files required to fulfill the user's utterances.
 */

type Files = {
  path: string;
  content: string;
}[];

export default async function createUpdateAgentToolHandler({
  files,
  step,
  network,
  sandboxId,
}: {
  files: Files;
  step: any;
  network: NetworkRun<StateData>;
  sandboxId: string;
}) {
  const newFiles = await step?.run("createOrUpdateFiles", async () => {
    try {
      /**
       * Because this step can be called N times, choosing an object instead of an array
       * for data.files (when falsy) allows overwriting any path if it changes.
       */
      const updatedFiles = network.state.data.files ?? {};
      const sandbox = await getSandbox(sandboxId);
      for (const file of files) {
        await sandbox.files.write(file.path, file.content);
        updatedFiles[file.path] = file.content;
      }

      return updatedFiles;
    } catch (error) {
      return `Error: ${error}`;
    }
  });

  /**
   * Wait for the newFiles step before storing into internal network state.
   * If an error occurs, newFiles will be a string; otherwise an object.
   * When newFiles is an object, it indicates a successful run.
   */
  if (typeof newFiles === "object") {
    network.state.data.files = newFiles;
  }

  return newFiles;
}
