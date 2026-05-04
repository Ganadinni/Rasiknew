import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // auth() throws when NEXTAUTH_SECRET/AUTH_SECRET is missing or DB is unreachable.
    // Render children so the login page still shows — middleware handles redirects.
  }

  if (!session?.user) return <>{children}</>;

  return (
    <AdminShell user={{ name: session.user.name ?? null, email: session.user.email ?? "", role: (session.user as { role?: string }).role ?? "STAFF" }}>
      {children}
    </AdminShell>
  );
}
