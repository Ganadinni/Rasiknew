/**
 * Auth.js catch-all route handler.
 * Mounts at /api/auth/* to handle sign-in, sign-out, session, and CSRF endpoints.
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
