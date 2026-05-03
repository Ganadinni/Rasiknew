import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { RequestStatus } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customer Requests | Rasik" };

const statusVariant = {
  [RequestStatus.NEW]: "warning" as const,
  [RequestStatus.REVIEWED]: "info" as const,
  [RequestStatus.CLOSED]: "success" as const,
};

export default async function CustomerRequestsPage() {
  const requests = await prisma.customerRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Customer Requests</h1>
        <p className="text-gray-500 text-sm mt-1">
          Product mapping requests generated when Rasik can't find an exact match.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-3">◎</p>
          <p className="font-semibold text-gray-600">No requests yet</p>
          <p className="text-sm text-gray-400 mt-1">
            When Rasik can't match a product, it creates a customer specification request here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={req.status} variant={statusVariant[req.status]} />
                    {req.mappedApplicationType && (
                      <Badge label={req.mappedApplicationType} variant="info" />
                    )}
                    {req.customerName && (
                      <span className="text-sm font-medium text-gray-700">{req.customerName}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{req.requestText}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>

              {req.whatsappText && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 mt-2">
                  <p className="text-xs font-semibold text-green-700 mb-1">WhatsApp Message</p>
                  <p className="text-xs text-green-800 whitespace-pre-wrap">{req.whatsappText}</p>
                  <button
                    onClick={() => {}}
                    className="mt-2 text-xs text-green-600 underline"
                  >
                    Copy to clipboard
                  </button>
                </div>
              )}

              {req.suggestedSkuJson && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-2">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Suggested SKUs</p>
                  <pre className="text-xs text-blue-800 whitespace-pre-wrap">
                    {JSON.stringify(req.suggestedSkuJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
