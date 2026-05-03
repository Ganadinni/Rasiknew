"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  await requireAuth();
  await prisma.customerRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/customer-requests");
}

export async function deleteRequest(id: string) {
  await requireAuth();
  await prisma.customerRequest.delete({ where: { id } });
  revalidatePath("/admin/customer-requests");
}
