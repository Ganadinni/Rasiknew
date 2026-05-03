import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AdminShellProps {
  children: React.ReactNode;
  user: { name: string | null; email: string; role: string };
}

export function AdminShell({ children, user }: AdminShellProps) {
  return (
    <div className="flex h-screen bg-brand-50 overflow-hidden">
      <Sidebar role={user.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
