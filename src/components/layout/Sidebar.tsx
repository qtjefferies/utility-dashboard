import React from 'react';
import { Home, Briefcase, Building2, DollarSign, CheckSquare, Users, Settings, Sparkles, TrendingUp } from 'lucide-react';
import { NavItem } from './NavItem';
import { homeData } from '../../data/mockData';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onAIClick?: () => void;
  theme?: 'light' | 'dark';
  complianceItems?: Array<{ status: string; priority?: string }>;
}

export function Sidebar({ currentPage, onNavigate, onAIClick, theme = 'dark', complianceItems }: SidebarProps) {
  // Calculate compliance badge count (only overdue items)
  const items = complianceItems ?? homeData.compliance.items ?? [];
  const complianceCount = items.filter(
    item => item.status === 'overdue'
  ).length || 0;

  const navItems = [
    { id: 'home', icon: Home, label: "Home" },
    { id: 'deals', icon: Briefcase, label: "Deals & Income" },
    { id: 'taxes', icon: Building2, label: "Taxes & Vault" },
    { id: 'cashflow', icon: DollarSign, label: "Cash Flow" },
    { id: 'compliance', icon: CheckSquare, label: "Compliance", badge: complianceCount },
    { id: 'market', icon: TrendingUp, label: "My Future Money" },
    { id: 'people', icon: Users, label: "My People" },
    { id: 'settings', icon: Settings, label: "Settings" },
  ];

  return (
    <aside className={`fixed left-0 top-0 w-72 border-r px-5 py-8 flex flex-col h-screen ${
      theme === 'light'
        ? 'border-emerald-200 bg-stone-50'
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
            badge={item.badge}
          />
        ))}
      </nav>
    </aside>
  );
}
