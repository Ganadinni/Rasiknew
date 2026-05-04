import { NextResponse } from "next/server";

// Intercept NextAuth's error route before the catch-all handler crashes
export function GET() {
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
}
