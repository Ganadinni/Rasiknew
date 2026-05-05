"use client";

import { useRef, useState } from "react";

interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  blobUrl?: string;
}

export function FileImportBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setResult(null);
    setError(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/import", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-brand-200 rounded-2xl p-10 text-center bg-brand-50 hover:border-brand-400 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <input
          ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <p className="text-4xl mb-3">{loading ? "⏳" : "📂"}</p>
        <p className="font-semibold text-brand-800">
          {loading ? `Importing ${fileName}…` : "Drop your Excel or CSV here"}
        </p>
        <p className="text-sm text-brand-500 mt-1">or click to browse</p>
        <p className="text-xs text-gray-400 mt-3">Accepts .xlsx · .xls · .csv — products upserted by SKU</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Success */}
      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 space-y-3">
          <p className="font-semibold text-emerald-800">Import Complete ✓</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold text-emerald-700">{result.created}</p><p className="text-xs text-emerald-600">New products</p></div>
            <div><p className="text-2xl font-bold text-blue-700">{result.updated}</p><p className="text-xs text-blue-600">Updated</p></div>
            <div><p className="text-2xl font-bold text-gray-500">{result.skipped}</p><p className="text-xs text-gray-500">Skipped</p></div>
          </div>
          {result.blobUrl && (
            <p className="text-xs text-gray-500 break-all">
              Saved to storage:{" "}
              <a href={result.blobUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">
                {result.blobUrl}
              </a>
            </p>
          )}
          {result.errors.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-700 mb-1">Row errors ({result.errors.length}):</p>
              <ul className="text-xs text-red-600 space-y-0.5 max-h-32 overflow-y-auto">
                {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Excel column guide */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-600 mb-3">Excel column headers the app recognises</p>
        <table className="text-xs w-full">
          <thead>
            <tr className="text-gray-400 border-b border-gray-200">
              <th className="text-left pb-1.5 pr-4">Field</th>
              <th className="text-left pb-1.5">Accepted column names in your Excel</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y divide-gray-100">
            {[
              ["SKU *", "SKU, SKU Code, Product Code, Item Code, Code"],
              ["Name *", "Product Name, Name, Item Name, Product"],
              ["Category", "Category"],
              ["Subcategory", "Subcategory, Sub Category, Sub-Category"],
              ["Application", "Application Type, Application, App Type"],
              ["Price", "Price, Unit Price, Cost"],
              ["Unit", "Unit, UOM, Unit of Measure"],
              ["Pack Size", "Pack Size, Pack, Size"],
              ["Notes", "Notes, Note, Remarks, Remark"],
            ].map(([field, names]) => (
              <tr key={field}>
                <td className="py-1.5 pr-4 font-medium text-gray-700 whitespace-nowrap">{field}</td>
                <td className="py-1.5 text-gray-400">{names}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2">* Required. All other columns are optional. Extra columns are ignored.</p>
      </div>
    </div>
  );
}
