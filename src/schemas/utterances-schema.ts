import { z } from "zod";

export const utteranceValueSchema = z
  .string()
  .min(1, { message: "Value is required" })
  .max(1024, { message: "Value cannot exceed 1024 chars" });
