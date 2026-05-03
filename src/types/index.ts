import type { Role } from "@prisma/client";

/** Extended session user with role. */
export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
}

/** Tea Planet recipe content structure (placeholder — expanded later). */
export interface RecipeContent {
  skuCode?: string;
  ingredients: IngredientRow[];
  preparationSteps: string[];
  sellingNotes?: string;
  demoNotes?: string;
}

export interface IngredientRow {
  ingredient: string;
  sku?: string;
  dosageGrams?: number;
  dosageMl?: number;
  notes?: string;
}
