"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "Create a Hot Masala Chai recipe for FOFO cafe",
  "Map a competitor matcha latte to Tea Planet products",
  "Build a boba cake recipe using Sponge Boba Flavours",
  "Generate a demo menu for Distributor Demo — 5 cold drinks",
  "Write a barista training SOP for making Silky Mix drinks",
];

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/rasik/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, sessionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${e instanceof Error ? e.message : "Unknown error"}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function saveRecipe(content: string) {
    try {
      await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawContent: content, sessionId }),
      });
      alert("Recipe saved to Recipes library.");
    } catch {
      alert("Failed to save recipe.");
    }
  }

  async function copyWhatsApp(content: string) {
    const match = content.match(/Hi \[.*?\][\s\S]*?The Tea Planet Team/);
    const text = match ? match[0] : content;
    await navigator.clipboard.writeText(text);
    alert("WhatsApp message copied to clipboard.");
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
          R
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Rasik – Culinary Maestro</p>
          <p className="text-xs text-gray-400">The Tea Planet's AI Recipe Assistant</p>
        </div>
        {sessionId && (
          <button
            onClick={() => { setMessages([]); setSessionId(null); }}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600"
          >
            New Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-500 text-3xl mx-auto mb-4">
              ✦
            </div>
            <p className="font-semibold text-gray-700 mb-1">Ask Rasik anything</p>
            <p className="text-sm text-gray-400 mb-6">
              Recipes, SKU mapping, demo menus, SOPs, training content
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-full px-3 py-1.5 transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            onSaveRecipe={msg.role === "assistant" ? saveRecipe : undefined}
            onCopyWhatsApp={msg.role === "assistant" ? copyWhatsApp : undefined}
          />
        ))}

        {loading && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold mr-1">
              R
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask Rasik for a recipe, SKU mapping, demo menu…"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shrink-0"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 ml-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
