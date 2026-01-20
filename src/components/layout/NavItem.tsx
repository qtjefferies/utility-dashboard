import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  theme?: 'light' | 'dark';
}

export function NavItem({ icon: Icon, label, active, onClick, theme = 'dark' }: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3",
        active 
          ? "bg-emerald-600/20 text-emerald-600" 
          : theme === 'light'
            ? "text-gray-600 hover:bg-gray-100"
            : "text-neutral-300 hover:bg-neutral-900",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
      {label}
    </div>
  );
}
