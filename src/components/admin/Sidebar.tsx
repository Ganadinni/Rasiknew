"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/admin/chat", label: "Rasik AI", icon: "✦" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/recipes", label: "Recipes", icon: "◉" },
  { href: "/admin/customer-requests", label: "Customer Requests", icon: "◎" },
  { href: "/admin/rules", label: "Prompt Rules", icon: "◆", adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: "⚙", adminOnly: true },
];

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";

  return (
    <aside className="w-56 bg-brand-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-brand-800">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
            R
          </span>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Rasik</p>
            <p className="text-brand-400 text-xs">Culinary Maestro</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-brand-500 text-white font-medium"
                  : "text-brand-300 hover:bg-brand-800 hover:text-white"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Import shortcut */}
      <div className="px-4 py-4 border-t border-brand-800">
        <Link
          href="/admin/products/import"
          className="block text-center text-xs bg-brand-600 hover:bg-brand-500 text-white rounded-lg py-2 transition-colors"
        >
          + Import Catalog
        </Link>
      </div>
    </aside>
  );
}
