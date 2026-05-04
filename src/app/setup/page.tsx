import { SetupClient } from "./SetupClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Database Setup | Rasik" };

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-500 mb-4">
            <span className="text-2xl text-white font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-900">Rasik Setup</h1>
          <p className="text-brand-600 text-sm mt-1">Culinary Maestro · The Tea Planet</p>
        </div>

        <SetupClient />
      </div>
    </main>
  );
}
