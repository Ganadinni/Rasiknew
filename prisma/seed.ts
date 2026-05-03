/**
 * Seeds the first ADMIN user from environment variables.
 * Run: npm run db:seed
 *
 * Required env vars (copy from .env.example):
 *   ADMIN_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_NAME
 */

import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !passwordHash) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in your .env file before seeding."
    );
  }

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name,
      role: Role.ADMIN,
    },
  });

  console.log(`✅  Admin user ready: ${admin.email} (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
