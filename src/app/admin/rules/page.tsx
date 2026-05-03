import { prisma } from "@/lib/prisma";
import { RulesClient } from "./RulesClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Prompt Rules | Rasik" };

export default async function RulesPage() {
  const rules = await prisma.promptRule.findMany({ orderBy: { priority: "desc" } });
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Prompt Rules</h1>
        <p className="text-gray-500 text-sm mt-1">
          Rules are injected into Rasik's system prompt. Higher priority rules are added first.
        </p>
      </div>
      <RulesClient initialRules={rules} />
    </div>
  );
}
