import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings | Rasik" };

const ENV_VARS = [
  { key: "AI_PROVIDER", desc: "openai or anthropic", required: true },
  { key: "OPENAI_API_KEY", desc: "Required if AI_PROVIDER=openai", required: false },
  { key: "ANTHROPIC_API_KEY", desc: "Required if AI_PROVIDER=anthropic", required: false },
  { key: "AI_MODEL", desc: "Optional — defaults: gpt-4o or claude-sonnet-4-6", required: false },
  { key: "DATABASE_URL", desc: "Pooled Neon Postgres URL", required: true },
  { key: "PRISMA_DATABASE_URL", desc: "Direct Neon Postgres URL for migrations", required: true },
  { key: "NEXTAUTH_SECRET", desc: "JWT signing secret (openssl rand -base64 32)", required: true },
  { key: "NEXTAUTH_URL", desc: "Your app URL (https://your-app.vercel.app)", required: true },
  { key: "ADMIN_EMAIL", desc: "Admin user email for seed", required: true },
  { key: "ADMIN_PASS", desc: "Admin plain password (hashed on seed)", required: true },
];

const DOSAGE_DEFAULTS = [
  { product: "Silky Mix", hot: "10–15 g / 100 ml", cold: "30 g / 350 ml" },
  { product: "Standard serving (Hot)", hot: "100 ml", cold: "—" },
  { product: "Standard serving (Cold/Iced/Frappe)", hot: "—", cold: "350 ml" },
];

export default function SettingsPage() {
  const aiProvider = process.env.AI_PROVIDER ?? "Not configured";
  const aiModel = process.env.AI_MODEL ?? "(default)";
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Application configuration and AI provider status</p>
      </div>

      {/* AI Status */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-800 mb-4">AI Provider Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">Provider</span>
            <span className={`text-sm font-semibold ${aiProvider === "Not configured" ? "text-red-600" : "text-green-600"}`}>
              {aiProvider}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">Model</span>
            <span className="text-sm text-gray-800">{aiModel}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">OpenAI Key</span>
            <span className={`text-sm font-medium ${hasOpenAI ? "text-green-600" : "text-gray-400"}`}>
              {hasOpenAI ? "Configured ✓" : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Anthropic Key</span>
            <span className={`text-sm font-medium ${hasAnthropic ? "text-green-600" : "text-gray-400"}`}>
              {hasAnthropic ? "Configured ✓" : "Not set"}
            </span>
          </div>
        </div>
        {aiProvider === "Not configured" && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            ⚠ Add <code className="font-mono">AI_PROVIDER</code> and an API key in Vercel
            Environment Variables to activate Rasik AI.
          </div>
        )}
      </div>

      {/* Standard Dosages */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Standard Dosage Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Product</th>
                <th className="text-left py-2 text-gray-500 font-medium">Hot</th>
                <th className="text-left py-2 text-gray-500 font-medium">Cold / Iced / Frappe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DOSAGE_DEFAULTS.map((d) => (
                <tr key={d.product}>
                  <td className="py-2 text-gray-700 font-medium">{d.product}</td>
                  <td className="py-2 text-gray-600">{d.hot}</td>
                  <td className="py-2 text-gray-600">{d.cold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Env vars reference */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Environment Variables Reference</h2>
        <div className="space-y-2">
          {ENV_VARS.map((v) => (
            <div key={v.key} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
              <code className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded shrink-0 mt-0.5">
                {v.key}
              </code>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
              <span className={`text-xs shrink-0 ${v.required ? "text-red-500" : "text-gray-400"}`}>
                {v.required ? "Required" : "Optional"}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          All environment variables must be set in Vercel Dashboard → Settings → Environment Variables.
          Never commit secrets to git.
        </p>
      </div>
    </div>
  );
}
