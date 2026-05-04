import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/StatCard";
import { RequestStatus } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | Rasik" };

export default async function DashboardPage() {
  let products = 0, recipes = 0, chatSessions = 0, pendingRequests = 0, rules = 0;
  let recentRecipes: { id: string; title: string; style: string | null; application: string | null; createdAt: Date }[] = [];
  let dbError = false;

  try {
    [products, recipes, chatSessions, pendingRequests, rules] = await Promise.all([
      prisma.product.count(),
      prisma.recipe.count(),
      prisma.chatSession.count(),
      prisma.customerRequest.count({ where: { status: RequestStatus.NEW } }),
      prisma.promptRule.count({ where: { isActive: true } }),
    ]);
    recentRecipes = await prisma.recipe.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, style: true, application: true, createdAt: true },
    });
  } catch (err) {
    console.error("[Dashboard] DB error:", err);
    dbError = true;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">The Tea Planet — Rasik Culinary Maestro</p>
      </div>

      {dbError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          Database unreachable. Check your <code>DATABASE_URL</code> environment variable in Vercel, then visit{" "}
          <a href="/setup" className="underline">/setup</a> to initialise.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Products" value={products} sub="in catalog" color="amber" />
        <StatCard label="Recipes" value={recipes} sub="saved" color="green" />
        <StatCard label="Chat Sessions" value={chatSessions} sub="total" color="blue" />
        <StatCard label="Pending Requests" value={pendingRequests} sub="customer" color="red" />
        <StatCard label="Active Rules" value={rules} sub="prompt rules" color="amber" />
      </div>

      {!dbError && products <= 2 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-amber-500 text-xl">⚠</span>
          <div>
            <p className="font-semibold text-amber-800">Catalog import required</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Only sample products exist. Import your Tea Planet catalog to enable full AI recipe generation.
            </p>
            <a href="/admin/products/import" className="inline-block mt-2 text-sm text-amber-700 underline hover:text-amber-900">
              Import Catalog →
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Recipes</h2>
            <a href="/admin/recipes" className="text-xs text-brand-500 hover:underline">View all</a>
          </div>
          {recentRecipes.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No recipes yet. Ask Rasik to generate one!</p>
          ) : (
            <ul className="space-y-2">
              {recentRecipes.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.style ?? ""}{r.application ? ` · ${r.application}` : ""}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/chat", label: "Ask Rasik", sub: "Generate recipes & content", icon: "✦" },
              { href: "/admin/products/import", label: "Import Catalog", sub: "Upload CSV or XLSX", icon: "📂" },
              { href: "/admin/recipes", label: "Recipes Library", sub: "Browse saved recipes", icon: "◉" },
              { href: "/admin/customer-requests", label: "Requests", sub: `${pendingRequests} pending`, icon: "◎" },
            ].map((a) => (
              <a key={a.href} href={a.href} className="block bg-brand-50 hover:bg-brand-100 border border-brand-100 rounded-xl p-4 transition-colors">
                <p className="text-xl mb-1">{a.icon}</p>
                <p className="font-semibold text-brand-800 text-sm">{a.label}</p>
                <p className="text-xs text-brand-600">{a.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
