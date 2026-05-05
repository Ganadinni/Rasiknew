"use client";

import { useState, useTransition } from "react";
import { createUser, deleteUser, resetPassword } from "@/server/actions/users";

type User = { id: string; email: string; name: string | null; role: string; createdAt: Date };

export function UsersClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");

  function feedback(fn: () => Promise<void>) {
    setError(null); setSuccess(null);
    startTransition(async () => {
      try { await fn(); setSuccess("Done."); setShowForm(false); setResetId(null); setNewPass(""); }
      catch (e: unknown) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    });
  }

  return (
    <div className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">{success}</div>}

      {/* User cards — mobile friendly */}
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">{u.name ?? "—"}</p>
                <p className="text-gray-400 text-xs truncate">{u.email}</p>
                <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"}`}>
                  {u.role}
                </span>
              </div>
              <div className="flex flex-col gap-1 items-end shrink-0">
                <button onClick={() => { setResetId(u.id); setNewPass(""); setError(null); setSuccess(null); }}
                  className="text-xs text-brand-600 hover:text-brand-800 font-medium">
                  Reset Password
                </button>
                {u.id !== currentUserId && (
                  <button disabled={isPending}
                    onClick={() => { if (!confirm(`Delete ${u.email}?`)) return; feedback(() => deleteUser(u.id)); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reset password */}
      {resetId && (
        <div className="bg-white border border-brand-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-800">Reset Password</h3>
          <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          <div className="flex gap-2">
            <button disabled={isPending || newPass.length < 8}
              onClick={() => feedback(() => resetPassword(resetId, newPass))}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-200 text-white text-sm font-semibold rounded-lg px-4 py-2 flex-1 transition-colors">
              Save
            </button>
            <button onClick={() => setResetId(null)} className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2 border border-gray-200 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button onClick={() => { setShowForm(true); setError(null); setSuccess(null); }}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors w-full sm:w-auto">
          + Add User
        </button>
      )}

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); feedback(() => createUser(new FormData(e.currentTarget))); }}
          className="bg-white border border-brand-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">Create New User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
              { name: "email", label: "Email", type: "email", placeholder: "jane@teaplanet.com" },
              { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters" },
            ].map((f) => (
              <div key={f.name}>
                <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                <input name={f.name} type={f.type} required minLength={f.name === "password" ? 8 : undefined}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Role</label>
              <select name="role" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-200 text-white text-sm font-semibold rounded-lg px-5 py-2 flex-1 sm:flex-none transition-colors">
              {isPending ? "Creating…" : "Create User"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2 border border-gray-200 rounded-lg">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
