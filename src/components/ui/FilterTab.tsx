import React from 'react';

interface FilterTabProps {
  active: boolean;
  onClick: () => void;
  label: string;
  theme?: 'light' | 'dark';
}

export function FilterTab({ active, onClick, label, theme = 'dark' }: FilterTabProps) {
  const inactiveStyles = theme === 'light'
    ? "bg-white text-gray-600 hover:bg-emerald-50 border border-emerald-200"
    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800";

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-base font-medium transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : inactiveStyles
      }`}
    >
      {label}
    </button>
  );
}
