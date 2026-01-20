import React from 'react';
import { Home, Briefcase, Building2, DollarSign, CheckSquare, Users, Settings, Sparkles, TrendingUp } from 'lucide-react';
import { NavItem } from './NavItem';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onAIClick?: () => void;
  theme?: 'light' | 'dark';
}

export function Sidebar({ currentPage, onNavigate, onAIClick, theme = 'dark' }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: "Home" },
    { id: 'deals', icon: Briefcase, label: "Deals & Income" },
    { id: 'taxes', icon: Building2, label: "Taxes & Vault" },
    { id: 'cashflow', icon: DollarSign, label: "Cash Flow" },
    { id: 'compliance', icon: CheckSquare, label: "Compliance" },
    { id: 'market', icon: TrendingUp, label: "My Future Money" },
    { id: 'people', icon: Users, label: "My People" },
    { id: 'settings', icon: Settings, label: "Settings" },
  ];

  return (
    <aside className={`fixed left-0 top-0 w-72 border-r px-5 py-8 flex flex-col h-screen ${
      theme === 'light' 
        ? 'border-gray-200 bg-white' 
        : 'border-neutral-800 bg-neutral-900/30'
    }`}>
      <div className={`mb-8 flex items-center gap-3 text-xl font-semibold ${
        theme === 'light' ? 'text-gray-900' : 'text-neutral-100'
      }`}>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-base text-white">U</div>
        Utility
      </div>

      <nav className="space-y-2 text-base flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={currentPage === item.id}
            onClick={() => onNavigate(item.id)}
            theme={theme}
          />
        ))}
      </nav>

      <button
        onClick={onAIClick}
        className={`mt-auto flex items-center gap-3 text-base px-4 py-3 rounded-xl cursor-pointer transition-all w-full ${
          theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-neutral-800'
        }`}
        style={{
          background: theme === 'light' 
            ? 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))'
            : 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))',
          border: theme === 'light'
            ? '1px solid rgba(16, 185, 129, 0.3)'
            : '1px solid rgba(16, 185, 129, 0.4)',
          color: theme === 'light' ? '#059669' : '#a7f3d0'
        }}
      >
        <Sparkles className="h-5 w-5" />
        <span>AI Assistant</span>
      </button>
    </aside>
  );
}
