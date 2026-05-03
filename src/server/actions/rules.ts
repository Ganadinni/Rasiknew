"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if ((session.user as { role?: string }).role !== "ADMIN") throw new Error("Admin required");
  return session.user.id;
}

export async function createRule(data: {
  title: string;
  ruleText: string;
  priority: number;
  isActive: boolean;
}) {
  await requireAdmin();
  await prisma.promptRule.create({ data });
  revalidatePath("/admin/rules");
}

export async function updateRule(
  id: string,
  data: { title?: string; ruleText?: string; priority?: number; isActive?: boolean }
) {
  await requireAdmin();
  await prisma.promptRule.update({ where: { id }, data });
  revalidatePath("/admin/rules");
}

export async function deleteRule(id: string) {
  await requireAdmin();
  await prisma.promptRule.delete({ where: { id } });
  revalidatePath("/admin/rules");
}

export async function toggleRule(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.promptRule.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/rules");
}
