import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config — no bcryptjs or Prisma imports.
 * Used by middleware (Edge Runtime) only.
 * Full auth config with credentials provider lives in src/lib/auth.ts.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (pathname === "/admin/login") {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        return true;
      }

      if (pathname.startsWith("/admin")) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [],
};
