import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, string> = {
    app: "ok",
    auth_secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET ? "ok" : "MISSING",
    database_url: process.env.DATABASE_URL ? "ok" : "MISSING",
    admin_pass: process.env.ADMIN_PASS || process.env.ADMIN_PASSWORD_HASH ? "ok" : "MISSING",
  };

  let db = "unreachable";
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "ok";
  } catch (err) {
    console.error("[health] DB check failed:", err);
    db = "error";
  }
  checks.db = db;

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    { status: allOk ? "ok" : "degraded", checks, ts: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  );
}
