import { getSandbox } from "../utils";
import type { GetStepTools, Inngest } from "inngest";

/**
 * Get the updated list of files array;
 * Connect to the sandbox environment;
 * For each entry in the updated files array, create/update it in the sandbox environment;
 * This enable the model to create/update the files required to fulfill the user's utterances.
 */

export default async function readFilesAgentToolHandler({
  files,
  step,
  sandboxId,
}: {
  files: string[];
  step?: GetStepTools<Inngest.Any>;
  sandboxId: string;
}) {
  return await step?.run("readFiles", async () => {
    try {
      const sandbox = await getSandbox(sandboxId);
      const contents = [];

      for (const file of files) {
        const content = await sandbox.files.read(file);
        contents.push({ path: file, content });
      }

      /**
       * This output doesn't need a specificdata structure since it is
       * used by models to read files.
       */
      return JSON.stringify(contents);
    } catch (error) {
      return `Error: ${error as string}`;
    }
  });
}
