import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/admin/SignOutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Rasik – Culinary Maestro",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-brand-50">
      {/* Top nav */}
      <header className="bg-white border-b border-brand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-brand-900">
              Rasik – Culinary Maestro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {session.user.name ?? session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-brand-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-10">
          Welcome back, {session.user.name ?? "Admin"}.
        </p>

        {/* Placeholder cards — wired up in later steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Recipes", count: 0, href: "/admin/recipes" },
            { label: "Users", count: 0, href: "/admin/users" },
            { label: "AI Chats", count: 0, href: "/admin/chats" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-brand-100 p-6 shadow-sm"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-4xl font-bold text-brand-700 mt-1">
                {card.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
