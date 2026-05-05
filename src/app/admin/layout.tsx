import { AdminShell } from "@/components/admin/AdminShell";
import { cookies } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const isLoggedIn = !!store.get("rasik-auth");

  if (!isLoggedIn) return <>{children}</>;

  return (
    <AdminShell user={{ name: "Admin", email: "", role: "ADMIN" }}>
      {children}
    </AdminShell>
  );
}
