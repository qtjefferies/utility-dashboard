import React from 'react';

interface FilterTabProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export function FilterTab({ active, onClick, label }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-base font-medium transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
      }`}
    >
      {label}
    </button>
  );
}
