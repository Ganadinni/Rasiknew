interface ParsedRecipe {
  title: string;
  style: string | null;
  application: string | null;
  portion: string | null;
  contentJson: Record<string, unknown>;
}

export function parseRecipeFromText(text: string): ParsedRecipe {
  // Extract title (first ## heading or first line)
  const titleMatch = text.match(/^##\s+(.+)/m) ?? text.match(/Recipe Name[:\|]\s*(.+)/i);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled Recipe";

  // Extract header fields from table
  const style = extractTableField(text, "Style");
  const application = extractTableField(text, "Application");
  const portion = extractTableField(text, "Portion");

  // Extract ingredient rows
  const ingredients = extractIngredientTable(text);

  // Extract preparation steps
  const stepsMatch = text.match(/Section 3[:\s]+Preparation Steps([\s\S]*?)(?=Section 4|$)/i);
  const stepsRaw = stepsMatch ? stepsMatch[1].trim() : "";
  const steps = stepsRaw
    .split(/\n/)
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter((l) => l.length > 0);

  // Extract selling notes
  const notesMatch = text.match(/Section 4[:\s]+Selling[^(]*\([\s\S]*?\)([\s\S]*?)(?=$)/i) ??
    text.match(/Section 4[:\s]+[\s\S]*?Notes([\s\S]*?)(?=$)/i);
  const notesRaw = notesMatch ? notesMatch[1] : "";
  const sellingNotes = {
    visualCue: extractNote(notesRaw, "Visual Cue"),
    costEfficiency: extractNote(notesRaw, "Cost Efficiency"),
    pairingCrossSell: extractNote(notesRaw, "Pairing"),
    consistencyCheck: extractNote(notesRaw, "Consistency"),
    profitabilityHook: extractNote(notesRaw, "Profitability"),
  };

  return {
    title,
    style,
    application,
    portion,
    contentJson: {
      rawText: text,
      header: { title, style, application, portion },
      ingredients,
      steps,
      sellingNotes,
    },
  };
}

function extractTableField(text: string, field: string): string | null {
  const regex = new RegExp(`\\|\\s*${field}\\s*\\|\\s*([^|\\n]+)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractIngredientTable(text: string): Array<Record<string, string>> {
  const tableMatch = text.match(/Section 2[:\s]+Ingredient Matrix([\s\S]*?)(?=Section 3|$)/i);
  if (!tableMatch) return [];

  const rows = tableMatch[1]
    .split("\n")
    .filter((l) => l.includes("|"))
    .slice(2); // skip header + separator rows

  return rows.map((row) => {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    return {
      ingredient: cells[0] ?? "",
      sku: cells[1] ?? "",
      dosage: cells[2] ?? "",
      remarks: cells[3] ?? "",
    };
  }).filter((r) => r.ingredient.length > 0);
}

function extractNote(text: string, field: string): string {
  const regex = new RegExp(`\\*{0,2}${field}[^:]*:\\*{0,2}\\s*(.+)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}
