"use client";

import { useState } from "react";
import { createRule, updateRule, deleteRule, toggleRule } from "@/server/actions/rules";

interface Rule {
  id: string;
  title: string;
  ruleText: string;
  priority: number;
  isActive: boolean;
}

const EMPTY: Omit<Rule, "id"> = { title: "", ruleText: "", priority: 0, isActive: true };

export function RulesClient({ initialRules }: { initialRules: Rule[] }) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updateRule(editing.id, form);
        setRules((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
        setEditing(null);
      } else {
        await createRule(form);
        window.location.reload();
      }
      setForm(EMPTY);
      setCreating(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this rule?")) return;
    await deleteRule(id);
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleRule(id, !current);
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !current } : r)));
  }

  const showForm = creating || editing !== null;

  return (
    <div className="space-y-4">
      {!showForm && (
        <button
          onClick={() => { setCreating(true); setForm(EMPTY); }}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2 text-sm font-semibold"
        >
          + Add Rule
        </button>
      )}

      {showForm && (
        <div className="bg-white border border-brand-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-brand-900">{editing ? "Edit Rule" : "New Rule"}</h3>
          <input
            type="text"
            placeholder="Rule title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />
          <textarea
            placeholder="Rule text (injected into Rasik's system prompt)"
            value={form.ruleText}
            onChange={(e) => setForm({ ...form, ruleText: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none resize-none"
          />
          <div className="flex gap-3 items-center">
            <input
              type="number"
              placeholder="Priority (higher = injected first)"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
              className="w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.ruleText}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-lg px-4 py-2 text-sm font-semibold"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setEditing(null); setCreating(false); }}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {rules.map((rule) => (
        <div
          key={rule.id}
          className={`bg-white border rounded-2xl p-5 transition-opacity ${rule.isActive ? "" : "opacity-50"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  P{rule.priority}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${rule.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {rule.isActive ? "Active" : "Inactive"}
                </span>
                <p className="font-semibold text-gray-800">{rule.title}</p>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{rule.ruleText}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleToggle(rule.id, rule.isActive)}
                className="text-xs text-gray-400 hover:text-brand-600 px-2 py-1"
              >
                {rule.isActive ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => { setEditing(rule); setForm({ title: rule.title, ruleText: rule.ruleText, priority: rule.priority, isActive: rule.isActive }); }}
                className="text-xs text-brand-500 hover:text-brand-700 px-2 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(rule.id)}
                className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
              >
                Del
              </button>
            </div>
          </div>
        </div>
      ))}

      {rules.length === 0 && !showForm && (
        <p className="text-sm text-gray-400 text-center py-8">No rules yet. Add rules to guide Rasik's behaviour.</p>
      )}
    </div>
  );
}
