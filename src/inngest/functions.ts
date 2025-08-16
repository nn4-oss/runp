import { inngest } from "./client";

export const runjobs = inngest.createFunction(
  { id: "runp-test-function" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "10s");
    return { message: `Hello ${event.data.email}!` };
  },
);
