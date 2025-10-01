import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import {
  consumeMessagesPoints,
  getMessagesStatus,
} from "@/services/messages-service";

export const contactRouter = createTRPCRouter({
  status: protectedProcedure.query(async () => {
    try {
      const result = await getMessagesStatus();
      return result;
    } catch (error) {
      console.error("ContactRouter", error);
      return null;
    }
  }),
  sendRequest: protectedProcedure
    .input(
      z.object({
        subject: z.string(),
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

      const discordWebhookKey = process.env.DISCORD_CONTACT_WEBHOOK_URL;
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
  sendFeedback: protectedProcedure
    .input(
      z.object({
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

      // Consume points before sending message to ensure the rate limit isn't reached
      try {
        await consumeMessagesPoints();
      } catch (error) {
        // Internal error
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong.",
          });
        }

        // Rate limit response
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Message Rate Limit",
        });
      }

      const discordWebhookKey = process.env.DISCORD_FEEDBACK_WEBHOOK_URL;
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
            content: `[New User Feedback]: ${input.content}`,
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
