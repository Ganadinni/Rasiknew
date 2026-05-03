import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Login page renders without shell (middleware handles the redirect)
  if (!session?.user) return <>{children}</>;

  return (
    <AdminShell user={{ name: session.user.name ?? null, email: session.user.email ?? "", role: (session.user as { role?: string }).role ?? "STAFF" }}>
      {children}
    </AdminShell>
  );
}
