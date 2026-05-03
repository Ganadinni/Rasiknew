"use server";

/**
 * Server actions for authentication flows.
 * Thin wrappers around Auth.js signIn/signOut for use in RSC contexts.
 */

import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid input." };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: "/admin/dashboard",
    });
  } catch {
    return { error: "Invalid email or password." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
