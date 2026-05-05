"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MascotImage } from "@/components/MascotImage";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/admin/chat", label: "Rasik AI", icon: "✦" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/recipes", label: "Recipes", icon: "◉" },
  { href: "/admin/customer-requests", label: "Customer Requests", icon: "◎" },
  { href: "/admin/rules", label: "Prompt Rules", icon: "◆", adminOnly: true },
  { href: "/admin/users", label: "Users", icon: "◈", adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: "⚙", adminOnly: true },
];

export function Sidebar({ role, onClose }: { role: string; onClose?: () => void }) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";

  return (
    <aside className="w-64 md:w-56 h-full bg-brand-900 flex flex-col">
      {/* Logo + close */}
      <div className="px-4 py-4 border-b border-brand-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MascotImage size={40} />
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Rasik</p>
            <p className="text-brand-400 text-xs">Culinary Maestro</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-brand-400 hover:text-white p-1 rounded transition-colors" aria-label="Close menu">
            ✕
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                active ? "bg-brand-500 text-white font-medium" : "text-brand-300 hover:bg-brand-800 hover:text-white"
              }`}
            >
              <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Import shortcut */}
      <div className="px-4 py-4 border-t border-brand-800">
        <Link href="/admin/products/import" onClick={onClose}
          className="block text-center text-xs bg-brand-600 hover:bg-brand-500 text-white rounded-lg py-2.5 transition-colors">
          + Import Catalog
        </Link>
      </div>
    </aside>
  );
}
