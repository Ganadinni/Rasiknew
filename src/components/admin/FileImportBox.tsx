"use client";

import { useRef, useState } from "react";

interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export function FileImportBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      });
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
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-brand-200 rounded-2xl p-10 text-center bg-brand-50 hover:border-brand-400 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <p className="text-4xl mb-3">📂</p>
        <p className="font-semibold text-brand-800">
          {loading ? "Importing…" : "Drop CSV or XLSX here"}
        </p>
        <p className="text-sm text-brand-500 mt-1">or click to browse</p>
        <p className="text-xs text-gray-400 mt-3">
          Accepts: .csv, .xlsx, .xls — Products are upserted by SKU
        </p>
      </div>

      {loading && (
        <div className="text-center text-sm text-brand-600 animate-pulse">
          Processing your catalog…
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4">
          <p className="font-semibold text-emerald-800 mb-2">Import Complete</p>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-emerald-700">{result.created}</p>
              <p className="text-emerald-600">Created</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{result.updated}</p>
              <p className="text-blue-600">Updated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-500">{result.skipped}</p>
              <p className="text-gray-500">Skipped</p>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-red-700 mb-1">Errors ({result.errors.length}):</p>
              <ul className="text-xs text-red-600 space-y-0.5 max-h-32 overflow-y-auto">
                {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Column mapping reference */}
      <details className="text-xs text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700 font-medium">
          Supported column names
        </summary>
        <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-1 font-mono">
          <p>SKU: SKU, SKU Code, Product Code, Item Code</p>
          <p>Name: Product Name, Name, Item Name</p>
          <p>Category, Subcategory, Application Type</p>
          <p>Price, Unit, Pack Size</p>
          <p>Website URL, Generic Ingredients, Notes</p>
        </div>
      </details>
    </div>
  );
}
