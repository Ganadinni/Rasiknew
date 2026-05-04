"use client";

import { useState, useTransition } from "react";
import { createUser, deleteUser, resetPassword } from "@/server/actions/users";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
};

export function UsersClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");

  function feedback(fn: () => Promise<void>) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await fn();
        setSuccess("Done.");
        setShowForm(false);
        setResetId(null);
        setNewPass("");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    feedback(() => createUser(fd));
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">{success}</div>}

      {/* User list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name / Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800">{u.name ?? "—"}</p>
                  <p className="text-gray-400 text-xs">{u.email}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setResetId(u.id); setNewPass(""); setError(null); setSuccess(null); }}
                      className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                    >
                      Reset Password
                    </button>
                    {u.id !== currentUserId && (
                      <button
                        disabled={isPending}
                        onClick={() => {
                          if (!confirm(`Delete ${u.email}?`)) return;
                          feedback(() => deleteUser(u.id));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset password inline */}
      {resetId && (
        <div className="bg-white border border-brand-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Reset Password</h3>
          <div className="flex gap-3">
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              disabled={isPending || newPass.length < 8}
              onClick={() => feedback(() => resetPassword(resetId, newPass))}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-200 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              Save
            </button>
            <button onClick={() => setResetId(null)} className="text-sm text-gray-400 hover:text-gray-600 px-2">Cancel</button>
          </div>
        </div>
      )}

      {/* Add user button */}
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setError(null); setSuccess(null); }}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors"
        >
          + Add User
        </button>
      )}

      {/* Create user form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">Create New User</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
              <input name="name" required placeholder="Jane Doe" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input name="email" type="email" required placeholder="jane@teaplanet.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Password</label>
              <input name="password" type="password" required minLength={8} placeholder="Min 8 characters" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Role</label>
              <select name="role" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={isPending} className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-200 text-white text-sm font-semibold rounded-lg px-5 py-2 transition-colors">
              {isPending ? "Creating…" : "Create User"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-400 hover:text-gray-600 px-2">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
