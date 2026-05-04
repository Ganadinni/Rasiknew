"use server";

import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await getServerSession();
  if (!session?.id) throw new Error("Unauthorized");
  return session.id;
}

export async function deleteRecipe(id: string) {
  await requireAuth();
  await prisma.recipe.delete({ where: { id } });
  revalidatePath("/admin/recipes");
}

export async function duplicateRecipe(id: string) {
  const userId = await requireAuth();
  const original = await prisma.recipe.findUnique({ where: { id }, include: { ingredients: true } });
  if (!original) throw new Error("Not found");

  await prisma.recipe.create({
    data: {
      title: `${original.title} (Copy)`,
      style: original.style,
      application: original.application,
      portion: original.portion,
      contentJson: original.contentJson as object,
      createdById: userId,
      ingredients: {
        create: original.ingredients.map((ing) => ({
          productId: ing.productId,
          ingredientName: ing.ingredientName,
          sku: ing.sku,
          dosage: ing.dosage,
          remarks: ing.remarks,
        })),
      },
    },
  });
  revalidatePath("/admin/recipes");
}
