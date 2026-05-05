import Image from "next/image";
import { SetupClient } from "./SetupClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Database Setup | Rasik" };

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-block w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg ring-4 ring-brand-100">
            <Image src="/mascot.png" alt="Rasik" width={96} height={96} className="object-cover object-top w-full h-full scale-125" priority />
          </div>
          <h1 className="text-3xl font-bold text-brand-900">Rasik Setup</h1>
          <p className="text-brand-600 text-sm mt-1">Culinary Maestro · The Tea Planet</p>
        </div>
        <SetupClient />
      </div>
    </main>
  );
}
