/**
 * Zod schemas shared across server actions and API routes.
 */

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  style: z.string().optional(),
  application: z.string().optional(),
  portion: z.string().optional(),
  contentJson: z.record(z.unknown()),
});

export type RecipeInput = z.infer<typeof recipeSchema>;
