import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { importProducts } from "@/lib/catalog/importer";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".csv") && !fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
    return NextResponse.json({ error: "Unsupported file. Upload a CSV, XLSX, or XLS file." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Store original file to Vercel Blob
  let blobUrl: string | undefined;
  try {
    const blob = await put(`catalog/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });
    blobUrl = blob.url;
  } catch (e) {
    console.error("[import] Blob upload failed:", e);
    // Non-fatal — continue with import even if blob storage fails
  }

  // Parse file into rows
  let rows: Record<string, unknown>[] = [];
  try {
    if (fileName.endsWith(".csv")) {
      rows = parseCSV(buffer.toString("utf-8"));
    } else {
      rows = await parseXLSX(buffer);
    }
  } catch (e) {
    return NextResponse.json(
      { error: `Could not read file: ${e instanceof Error ? e.message : "Unknown error"}` },
      { status: 400 }
    );
  }

  const result = await importProducts(rows);
  return NextResponse.json({ ...result, blobUrl });
}

function parseCSV(content: string): Record<string, unknown>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const vals = splitCSVLine(line);
    const row: Record<string, unknown> = {};
    headers.forEach((h, i) => { row[h] = vals[i]?.trim().replace(/^"|"$/g, "") ?? ""; });
    return row;
  });
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes; continue; }
    if (char === "," && !inQuotes) { result.push(current); current = ""; continue; }
    current += char;
  }
  result.push(current);
  return result;
}

async function parseXLSX(buffer: Buffer): Promise<Record<string, unknown>[]> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, unknown>[];
}
