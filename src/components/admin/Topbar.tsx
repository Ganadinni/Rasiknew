"use client";

import { useRouter } from "next/navigation";

interface TopbarProps {
  user: { name: string | null; email: string; role: string };
  onMenuClick?: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className="text-sm text-gray-400 hidden sm:block">The Tea Planet</p>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium hidden sm:inline">
          {user.role}
        </span>
        <span className="text-sm text-gray-600 max-w-[120px] truncate hidden sm:inline">
          {user.name ?? "Admin"}
        </span>
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
