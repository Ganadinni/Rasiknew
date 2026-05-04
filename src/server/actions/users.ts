"use server";

import { isAuthenticated } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function requireAdmin() {
  if (!(await isAuthenticated())) throw new Error("Forbidden");
}

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "STAFF"]),
});

export async function createUser(formData: FormData) {
  await requireAdmin();
  const parsed = createUserSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { email, name, password, role } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("A user with this email already exists.");

  const passwordHash = await hash(password, 12);
  await prisma.user.create({ data: { email, name, passwordHash, role: role as Role } });
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function resetPassword(id: string, newPassword: string) {
  await requireAdmin();
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
  const passwordHash = await hash(newPassword, 12);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  revalidatePath("/admin/users");
}
