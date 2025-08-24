import { z } from "zod";

export const MAX_UTTERANCE_LENGTH = 1024;
export const utteranceValueSchema = z
  .string()
  .trim()
  .min(1, { message: "Value is required" })
  .max(1024, { message: `Value cannot exceed ${MAX_UTTERANCE_LENGTH} chars` });
