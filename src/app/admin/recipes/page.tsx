import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/admin/RecipeCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Recipes | Rasik" };

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Recipes</h1>
          <p className="text-gray-500 text-sm mt-1">{recipes.length} recipes saved</p>
        </div>
        <a
          href="/admin/chat"
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          ✦ Ask Rasik
        </a>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-5xl mb-4">◉</p>
          <p className="font-semibold text-gray-700">No recipes yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Ask Rasik to generate a recipe, then click "Save Recipe"</p>
          <a href="/admin/chat" className="text-sm text-brand-500 underline hover:text-brand-700">
            Open Rasik Chat →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              id={r.id}
              title={r.title}
              style={r.style}
              application={r.application}
              portion={r.portion}
              createdAt={r.createdAt.toISOString()}
              createdBy={r.createdBy.name ?? r.createdBy.email}
            />
          ))}
        </div>
      )}
    </div>
  );
}
