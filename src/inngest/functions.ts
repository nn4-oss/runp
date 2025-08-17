import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { openai, createAgent, createTool } from "@inngest/agent-kit";

import { z } from "zod";
import { getSandbox } from "./utils";

const SANDBOX_NAME = "runp-test-dev"; // SANDBOX_NAME relates to the E2B docker image's name, they MUST match
const SANDBOX_PORT = 3000; // nextjs sandbox template port
const SYSTEM_PROMPT =
  "You are an expert Next.js (App Router) + React + TypeScript app generator. Stack: Next.js, TypeScript, styled-components + @usefui/tokens/styles/components/icons/hooks/core, Zustand (UI state), @tanstack/react-query (server state, optimistic updates), react-hook-form + zod + @hookform/resolvers (forms), MDX (@mdx-js/react, next-mdx-remote, @next/mdx), @uiw/react-codemirror + @codemirror/lang-css/json (code editing), @usefui/analytics, react-syntax-highlighter, gray-matter, glob, date-fns, eslint, prettier, typescript-eslint. Output: return only code, always runnable Next.js TypeScript code. Goal: generate accessible, performant, production-ready apps with this stack.";

export const invokeCodeAgent = inngest.createFunction(
  { id: "runp-code-agent-invoke-function" },
  { event: "code-agent/invoke" },

  async ({ event, step }) => {
    /**
     * Create a Sandbox Environment using the E2B NextJS Template Docker Image,
     */
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(SANDBOX_NAME);
      return sandbox.sandboxId;
    });

    /**
     * Run the code-agent using user's utterance;
     * [TODO]: Decrypt and pass the user's oai key */

    // const userId = (event.data as { userId: string } | undefined)?.userId;
    // const apiKey = await db.userSecrets.getOpenAIKey(userId); // decrypt in-memory

    const codeAgent = createAgent({
      name: "code-agent",
      system: SYSTEM_PROMPT,
      model: openai({
        model: "gpt-4o",
        // apiKey,
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),

          handler: async ({ command }, { step }) => {
            /**
             * Connect to the sandbox environment;
             * run the command in the sandbox environment, report telemetry in buffers;
             * return the execution output on success, errlog(stdout,stderr) on failure;
             *
             * This enable to keep the contexts of executions and give it to the model to refine inferences after each loop.
             */
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
          },
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

          handler: async ({ files }, { step, network }) => {
            /**
             * Get the updated list of files array;
             * Connect to the sandbox environment;
             * For each entry in the updated files array, create/update it in the sandbox environment;
             * This enable the model to create/update the files required to fulfill the user's utterances.
             */

            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  /**
                   * Because this step can be called N times, chosing an object instead of an array
                   * in the case of data.files being falsy when the handler is invoked enables to overwrite any path if it changes.
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
              },
            );

            /**
             * Wait for the newFiles step before storing it into the internal network state.
             * It an error occurs, newFiles will return a string, object otherwise.
             * When the type of newFiles equals to object, it indicates a succesfull run.
             */
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox environment",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
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
                return `Error: ${error}`;
              }
            });
          },
        }),
      ],
    });

    const { output } = await codeAgent.run(event.data.input);
    if (!output) return { success: false };

    /**
     * Prepare the Sandbox Environment URL that will run the code-agent output
     */
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(SANDBOX_PORT);

      return `https://${host}`;
    });

    return { success: true, output, sandboxUrl };
  },
);
