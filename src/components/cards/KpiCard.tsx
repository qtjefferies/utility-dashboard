import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  sub?: string;
  positive?: boolean;
}

export function KpiCard({ title, value, sub, positive }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-8">
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-wide text-neutral-500">{title}</div>
      {sub && (
        <div className={`mt-3 text-sm ${positive ? "text-emerald-400" : "text-neutral-400"}`}>
          {positive ? `↗ ${sub}` : sub}
        </div>
      )}
    </div>
  );
}
