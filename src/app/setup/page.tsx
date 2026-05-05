import { SetupClient } from "./SetupClient";
import { MascotImage } from "@/components/MascotImage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Database Setup | Rasik" };

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MascotImage size={96} className="ring-4 ring-brand-100 shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-brand-900">Rasik Setup</h1>
          <p className="text-brand-600 text-sm mt-1">Culinary Maestro · The Tea Planet</p>
        </div>
        <SetupClient />
      </div>
    </main>
  );
}
