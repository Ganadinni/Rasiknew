import { FileImportBox } from "@/components/admin/FileImportBox";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Import Catalog | Rasik" };

export default function ImportPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Import Product Catalog</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload your Tea Planet XLSX or CSV catalog. Products are upserted by SKU — existing
          records are updated, new ones are created.
        </p>
      </div>
      <FileImportBox />
    </div>
  );
}
