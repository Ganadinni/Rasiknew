import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/DataTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products | Rasik" };

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  const rows = products.map((p) => ({
    sku: p.sku,
    name: p.name,
    category: p.category ?? "—",
    applicationType: p.applicationType ?? "—",
    price: p.price ? `${p.price} / ${p.unit ?? "unit"}` : "—",
    packSize: p.packSize ?? "—",
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <a
          href="/admin/products/import"
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          Import Catalog
        </a>
      </div>

      {products.length <= 2 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          ⚠ Only sample products exist. Import your Tea Planet XLSX/CSV catalog to get full AI functionality.
        </div>
      )}

      <DataTable
        columns={[
          { key: "sku", header: "SKU", width: "140px" },
          { key: "name", header: "Product Name" },
          { key: "category", header: "Category" },
          { key: "applicationType", header: "Application" },
          { key: "price", header: "Price" },
          { key: "packSize", header: "Pack Size" },
        ]}
        data={rows}
        searchable
        searchKeys={["sku", "name", "category", "applicationType"]}
        emptyMessage="No products found. Import your catalog to get started."
      />
    </div>
  );
}
