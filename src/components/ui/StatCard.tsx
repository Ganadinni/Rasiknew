interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color?: "amber" | "green" | "blue" | "red";
}

const colorMap = {
  amber: "text-brand-600 bg-brand-50 border-brand-100",
  green: "text-emerald-600 bg-emerald-50 border-emerald-100",
  blue: "text-blue-600 bg-blue-50 border-blue-100",
  red: "text-red-600 bg-red-50 border-red-100",
};

export function StatCard({ label, value, sub, color = "amber" }: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-6 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-4xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
}
