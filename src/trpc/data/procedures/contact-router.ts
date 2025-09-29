import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";

export const contactRouter = createTRPCRouter({
  contact: protectedProcedure
    .input(
      z.object({
        subject: z.enum(["feedback", "contact", "support"]).optional(),
        content: z
          .string()
          .min(1, {
            message: "Messages must be at least 1 character long",
          })
          .max(400, {
            message: "Messages cannot exceed 400 characters",
          }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth.isAuthenticated) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `Login to send messages`,
        });
      }

      const getWebhookKey = () => {
        if (input.subject === "contact")
          return process.env.DISCORD_CONTACT_WEBHOOK_URL;
        if (input.subject === "feedback")
          return process.env.DISCORD_FEEDBACK_WEBHOOK_URL;
        if (input.subject === "support")
          return process.env.DISCORD_SUPPORT_WEBHOOK_URL;
      };

      const discordWebhookKey = getWebhookKey();
      if (!discordWebhookKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to get webhook url",
        });
      }

      const response = await fetch(
        `https://discord.com/api/webhooks/${discordWebhookKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `[${input.subject}]: ${input.content}`,
            author: {
              username: ctx.user.email,
            },
          }),
        },
      );

      if (response.status !== 204) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Status: ${response.status}`,
        });
      }

      return true;
    }),
});
