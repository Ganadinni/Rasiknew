"use client";

import { useRouter } from "next/navigation";

interface TopbarProps {
  user: { name: string | null; email: string; role: string };
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <p className="text-sm text-gray-400">The Tea Planet — Internal Admin</p>
      <div className="flex items-center gap-4">
        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">{user.role}</span>
        <span className="text-sm text-gray-600">{user.name ?? user.email}</span>
        <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-red-600 transition-colors">
          Sign out
        </button>
      </div>
    </header>
  );
}
