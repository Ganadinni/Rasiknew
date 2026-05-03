import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

// Flexible column name mapping
const COLUMN_MAP: Record<string, string[]> = {
  sku: ["sku", "sku code", "product code", "item code", "code"],
  name: ["product name", "name", "item name", "product"],
  category: ["category"],
  subcategory: ["subcategory", "sub category", "sub-category"],
  applicationType: ["application type", "application", "app type"],
  price: ["price", "unit price", "cost"],
  unit: ["unit", "uom", "unit of measure"],
  packSize: ["pack size", "pack", "size"],
  websiteUrl: ["website url", "website", "url", "link"],
  genericIngredients: ["generic ingredients", "ingredients", "generic"],
  notes: ["notes", "note", "remarks", "remark"],
  distributorAvailability: ["distributor availability", "distributor", "available"],
};

function resolveHeader(header: string): string | null {
  const normalized = header.toLowerCase().trim();
  for (const [field, aliases] of Object.entries(COLUMN_MAP)) {
    if (aliases.includes(normalized)) return field;
  }
  return null;
}

function parseRows(rawRows: Record<string, unknown>[]): ImportResult["errors"] {
  return [];
}

export async function importProducts(
  rows: Record<string, unknown>[]
): Promise<ImportResult> {
  const result: ImportResult = { created: 0, updated: 0, skipped: 0, errors: [] };

  if (rows.length === 0) {
    result.errors.push("File is empty or has no data rows.");
    return result;
  }

  // Build column mapping from first row keys
  const headers = Object.keys(rows[0]);
  const colMap: Record<string, string> = {};
  for (const h of headers) {
    const field = resolveHeader(h);
    if (field) colMap[h] = field;
  }

  if (!Object.values(colMap).includes("sku")) {
    result.errors.push("No SKU column found. Expected: SKU, SKU Code, Product Code, or Item Code.");
    return result;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // 1-indexed + header row

    try {
      // Map row to product fields
      const mapped: Record<string, unknown> = {};
      for (const [rawCol, field] of Object.entries(colMap)) {
        mapped[field] = row[rawCol];
      }

      const sku = String(mapped.sku ?? "").trim();
      const name = String(mapped.name ?? "").trim();

      if (!sku) { result.skipped++; continue; }
      if (!name) {
        result.errors.push(`Row ${rowNum}: Missing product name for SKU "${sku}"`);
        result.skipped++;
        continue;
      }

      const priceRaw = mapped.price !== undefined && mapped.price !== "" ? Number(mapped.price) : null;
      const price = priceRaw !== null && !isNaN(priceRaw) ? priceRaw : null;

      const data = {
        name,
        category: mapped.category ? String(mapped.category).trim() : null,
        subcategory: mapped.subcategory ? String(mapped.subcategory).trim() : null,
        applicationType: mapped.applicationType ? String(mapped.applicationType).trim() : null,
        price: price !== null ? new Decimal(price) : null,
        unit: mapped.unit ? String(mapped.unit).trim() : null,
        packSize: mapped.packSize ? String(mapped.packSize).trim() : null,
        websiteUrl: mapped.websiteUrl ? String(mapped.websiteUrl).trim() : null,
        genericIngredients: mapped.genericIngredients ? String(mapped.genericIngredients).trim() : null,
        notes: mapped.notes ? String(mapped.notes).trim() : null,
        distributorAvailability:
          mapped.distributorAvailability !== undefined
            ? String(mapped.distributorAvailability).toLowerCase() !== "no" &&
              String(mapped.distributorAvailability).toLowerCase() !== "false" &&
              String(mapped.distributorAvailability) !== "0"
            : true,
      };

      const existing = await prisma.product.findUnique({ where: { sku } });
      if (existing) {
        await prisma.product.update({ where: { sku }, data });
        result.updated++;
      } else {
        await prisma.product.create({ data: { sku, ...data } });
        result.created++;
      }
    } catch (e) {
      result.errors.push(`Row ${rowNum}: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  return result;
}
