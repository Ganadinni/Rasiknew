import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UsersClient } from "./UsersClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users | Rasik" };

export default async function UsersPage() {
  const session = await auth();
  // @ts-expect-error custom role field
  if (session?.user?.role !== "ADMIN") redirect("/admin/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage who can log in to Rasik</p>
      </div>
      <UsersClient users={users} currentUserId={session!.user!.id!} />
    </div>
  );
}
