import { prisma } from "@/lib/prisma";

export async function buildCatalogContext(userMessage: string): Promise<string> {
  const keywords = extractKeywords(userMessage);
  if (keywords.length === 0) return await getTopProducts();

  const products = await prisma.product.findMany({
    where: {
      OR: [
        ...keywords.map((kw) => ({ name: { contains: kw, mode: "insensitive" as const } })),
        ...keywords.map((kw) => ({ sku: { contains: kw, mode: "insensitive" as const } })),
        ...keywords.map((kw) => ({ category: { contains: kw, mode: "insensitive" as const } })),
        ...keywords.map((kw) => ({ subcategory: { contains: kw, mode: "insensitive" as const } })),
        ...keywords.map((kw) => ({ applicationType: { contains: kw, mode: "insensitive" as const } })),
        ...keywords.map((kw) => ({ notes: { contains: kw, mode: "insensitive" as const } })),
        ...keywords.map((kw) => ({ genericIngredients: { contains: kw, mode: "insensitive" as const } })),
      ],
    },
    take: 20,
    orderBy: { name: "asc" },
  });

  if (products.length === 0) return await getTopProducts();
  return formatProducts(products);
}

async function getTopProducts() {
  const products = await prisma.product.findMany({
    take: 15,
    orderBy: { category: "asc" },
  });
  return products.length > 0 ? formatProducts(products) : "";
}

function formatProducts(
  products: Array<{
    sku: string;
    name: string;
    category: string | null;
    subcategory: string | null;
    applicationType: string | null;
    price: unknown;
    unit: string | null;
    packSize: string | null;
    genericIngredients: string | null;
    notes: string | null;
  }>
): string {
  return products
    .map((p) => {
      const price = p.price ? `Price: ${p.price} per ${p.unit ?? "unit"}` : "Price: Catalog import required";
      const appType = p.applicationType ? `Application: ${p.applicationType}` : "";
      const ingredients = p.genericIngredients ? `Ingredients: ${p.genericIngredients}` : "";
      const notes = p.notes ? `Notes: ${p.notes}` : "";
      return [
        `• ${p.name} | SKU: ${p.sku}`,
        `  Category: ${p.category ?? "—"} / ${p.subcategory ?? "—"}`,
        appType && `  ${appType}`,
        price && `  ${price}`,
        p.packSize && `  Pack Size: ${p.packSize}`,
        ingredients && `  ${ingredients}`,
        notes && `  ${notes}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function extractKeywords(message: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "can", "for", "of", "in",
    "on", "at", "to", "from", "with", "and", "or", "but", "not",
    "make", "me", "my", "i", "how", "what", "when", "which", "that",
    "this", "create", "give", "show", "list", "need", "want", "recipe",
    "please", "using", "use", "based", "suggest", "recommend",
  ]);

  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .slice(0, 8);
}
