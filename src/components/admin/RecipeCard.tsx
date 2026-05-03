"use client";

import { useState } from "react";

interface RecipeCardProps {
  id: string;
  title: string;
  style?: string | null;
  application?: string | null;
  portion?: string | null;
  createdAt: string;
  createdBy?: string | null;
  onDelete?: (id: string) => void;
}

export function RecipeCard({
  id,
  title,
  style,
  application,
  portion,
  createdAt,
  createdBy,
  onDelete,
}: RecipeCardProps) {
  const [copying, setCopying] = useState(false);

  async function copyLink() {
    setCopying(true);
    await navigator.clipboard.writeText(`Recipe: ${title} | ${style ?? ""} | ${portion ?? ""}`);
    setTimeout(() => setCopying(false), 1500);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {style && (
              <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{style}</span>
            )}
            {application && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{application}</span>
            )}
            {portion && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{portion}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {createdBy && <span>{createdBy} · </span>}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={copyLink}
            className="text-xs text-gray-400 hover:text-brand-600 px-2 py-1 rounded transition-colors"
          >
            {copying ? "Copied!" : "Copy"}
          </button>
          <a
            href={`/admin/recipes/${id}`}
            className="text-xs text-brand-600 hover:text-brand-800 px-2 py-1 rounded transition-colors"
          >
            View
          </a>
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded transition-colors"
            >
              Del
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
