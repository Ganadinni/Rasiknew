"use client";

import { useState } from "react";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  onSaveRecipe?: (content: string) => void;
  onCopyWhatsApp?: (content: string) => void;
}

export function MessageBubble({ role, content, onSaveRecipe, onCopyWhatsApp }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const isUser = role === "user";
  const isAssistant = role === "assistant";

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const hasRecipe = isAssistant && content.includes("Section 2: Ingredient Matrix");
  const hasWhatsApp = isAssistant && content.includes("The Tea Planet Team");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {isAssistant && (
        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
          R
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-brand-500 text-white rounded-br-sm"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
          }`}
        >
          {content}
        </div>

        {/* Action buttons for assistant messages */}
        {isAssistant && (
          <div className="flex gap-2 mt-1.5 ml-1">
            <button
              onClick={() => handleCopy(content)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            {hasRecipe && onSaveRecipe && (
              <button
                onClick={() => onSaveRecipe(content)}
                className="text-xs text-brand-500 hover:text-brand-700 font-medium transition-colors"
              >
                Save Recipe
              </button>
            )}
            {hasWhatsApp && onCopyWhatsApp && (
              <button
                onClick={() => onCopyWhatsApp(content)}
                className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Copy WhatsApp
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
