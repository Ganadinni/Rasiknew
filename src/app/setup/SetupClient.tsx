"use client";

import { useEffect, useState } from "react";

interface StatusResult {
  ready: boolean;
  adminCount: number;
  productCount: number;
  ruleCount: number;
  error?: string;
}

interface SetupResult {
  ok?: boolean;
  message?: string;
  admin?: { email: string; isNew: boolean };
  rulesCreated?: number;
  productsCreated?: number;
  error?: string;
}

export function SetupClient() {
  const [status, setStatus] = useState<StatusResult | null>(null);
  const [result, setResult] = useState<SetupResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  async function checkStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/setup");
      setStatus(await res.json());
    } catch {
      setStatus({ ready: false, adminCount: 0, productCount: 0, ruleCount: 0, error: "Cannot reach database" });
    } finally {
      setLoading(false);
    }
  }

  async function runSetup() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/setup", { method: "POST" });
      const data = await res.json();
      setResult(data);
      if (data.ok) await checkStatus();
    } catch {
      setResult({ error: "Setup request failed. Check your database environment variables." });
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => { checkStatus(); }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-brand-100 p-8 space-y-6">
      {/* DB Status */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Database Status</h2>
        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse">Checking connection…</p>
        ) : status?.error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            ❌ {status.error}
            <p className="mt-1 text-xs">Check that <code>DATABASE_URL</code> and <code>PRISMA_DATABASE_URL</code> are set in Vercel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Admin Users", value: status?.adminCount ?? 0, ok: (status?.adminCount ?? 0) > 0 },
              { label: "Prompt Rules", value: status?.ruleCount ?? 0, ok: (status?.ruleCount ?? 0) > 0 },
              { label: "Products", value: status?.productCount ?? 0, ok: (status?.productCount ?? 0) > 0 },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-3 text-center border ${s.ok ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                <p className={`text-2xl font-bold ${s.ok ? "text-emerald-700" : "text-amber-700"}`}>{s.value}</p>
                <p className={`text-xs mt-0.5 ${s.ok ? "text-emerald-600" : "text-amber-600"}`}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Already ready */}
      {status?.ready && !result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800">
          ✅ Database is already set up. Admin user exists.
          <div className="mt-3">
            <a
              href="/admin/login"
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            >
              Go to Admin Login →
            </a>
          </div>
        </div>
      )}

      {/* Setup button */}
      {!status?.ready && !loading && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Initialize Database</h2>
          <p className="text-sm text-gray-500 mb-4">
            This will create your admin account using <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">ADMIN_EMAIL</code> and <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">ADMIN_PASS</code> from your Vercel environment variables, and seed default prompt rules.
          </p>
          <button
            onClick={runSetup}
            disabled={running}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            {running ? "Setting up database…" : "🚀 Run Setup"}
          </button>
        </div>
      )}

      {/* Re-run option if ready */}
      {status?.ready && !loading && (
        <button
          onClick={runSetup}
          disabled={running}
          className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
        >
          {running ? "Running…" : "Re-run setup (safe — idempotent)"}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl px-4 py-4 border text-sm ${result.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>
          {result.ok ? (
            <>
              <p className="font-semibold mb-2">✅ {result.message}</p>
              <ul className="space-y-1 text-xs">
                <li>Admin: {result.admin?.email} {result.admin?.isNew ? "(newly created)" : "(already existed)"}</li>
                {(result.rulesCreated ?? 0) > 0 && <li>Prompt rules created: {result.rulesCreated}</li>}
                {(result.productsCreated ?? 0) > 0 && <li>Sample products created: {result.productsCreated}</li>}
              </ul>
              <div className="mt-4 flex gap-3">
                <a
                  href="/admin/login"
                  className="inline-block bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Go to Login →
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold mb-1">❌ Setup failed</p>
              <p className="text-xs">{result.error}</p>
              <p className="text-xs mt-2">Make sure <code>ADMIN_PASS</code>, <code>DATABASE_URL</code>, and <code>PRISMA_DATABASE_URL</code> are set in Vercel → Settings → Environment Variables.</p>
            </>
          )}
        </div>
      )}

      {/* What's next */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">After setup</p>
        <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
          <li>Go to <strong>/admin/login</strong> and sign in</li>
          <li>Import your Tea Planet catalog at <strong>Products → Import Catalog</strong></li>
          <li>Add <code>NEXTAUTH_URL</code> = your Vercel app URL in Vercel env vars</li>
          <li>Start asking Rasik for recipes at <strong>Rasik AI</strong></li>
        </ol>
      </div>
    </div>
  );
}
