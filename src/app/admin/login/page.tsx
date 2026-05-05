import { LoginForm } from "@/components/admin/LoginForm";
import { MascotImage } from "@/components/MascotImage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Login | Rasik – Culinary Maestro" };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MascotImage size={96} className="ring-4 ring-brand-100 shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-brand-900">Rasik</h1>
          <p className="text-brand-600 text-sm mt-1">Culinary Maestro · The Tea Planet</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-brand-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          First time?{" "}
          <a href="/setup" className="text-brand-500 hover:underline">Run database setup →</a>
        </p>
      </div>
    </main>
  );
}
