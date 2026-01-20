import React from 'react';

interface CardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export function Card({ title, className, children }: CardProps) {
  return (
    <div className={["rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8", className].join(" ")}>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-base font-semibold">{title}</div>
        <button className="text-neutral-500 hover:text-neutral-300">⋮</button>
      </div>
      {children}
    </div>
  );
}
