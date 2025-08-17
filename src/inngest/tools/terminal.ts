import { getSandbox } from "../utils";

/**
 * Connect to the sandbox environment;
 * run the command in the sandbox environment, report telemetry in buffers;
 * return the execution output on success, errlog(stdout,stderr) on failure;
 *
 * This enable to keep the contexts of executions and give it to the model to refine inferences after each loop.
 */

export default async function terminalAgentToolHandler({
  command,
  step,
  sandboxId,
}: {
  command: string;
  step: any;
  sandboxId: string;
}) {
  return await step?.run("terminal", async () => {
    const buffers = { stdout: "", stderr: "" };

    try {
      const sandbox = await getSandbox(sandboxId); //
      const result = await sandbox.commands.run(command, {
        onStdout: (data: string) => {
          buffers.stdout += data;
        },
        onStderr: (data: string) => {
          buffers.stderr += data;
        },
      });

      return result.stdout;
    } catch (e) {
      const errlog = `Command failed: ${e} \nstdout: ${buffers.stdout} \stderr: ${buffers.stderr}`;

      console.error(errlog);
      return errlog;
    }
  });
}
