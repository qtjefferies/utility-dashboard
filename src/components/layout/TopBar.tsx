import React from 'react';

interface Athlete {
  fullName: string;
  sport: string;
  year: string;
  initials: string;
}

interface TopBarProps {
  athlete: Athlete;
  theme?: 'light' | 'dark';
}

export function TopBar({ athlete, theme = 'dark' }: TopBarProps) {
  return (
    <div className={`sticky top-0 z-10 flex items-center justify-between border-b px-10 py-5 ${
      theme === 'light' 
        ? 'border-gray-200 bg-white' 
        : 'border-neutral-900 bg-neutral-950'
    }`}>
      <div className={`text-base ${theme === 'light' ? 'text-gray-400' : 'text-neutral-500'}`}> </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className={`text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-neutral-100'}`}>
            {athlete.fullName}
          </div>
          <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-neutral-500'}`}>
            {athlete.sport} • {athlete.year}
          </div>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-base font-bold text-white">
          {athlete.initials}
        </div>
      </div>
    </div>
  );
}
