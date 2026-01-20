import React from 'react';

interface PillProps {
  children: React.ReactNode;
  tone?: 'warn' | 'good';
}

export function Pill({ children, tone }: PillProps) {
  const styles =
    tone === "warn"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  return <span className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${styles}`}>{children}</span>;
}
