import React, { useState, useEffect, useMemo } from 'react';
import { Home, Briefcase, Building2, DollarSign, CheckSquare, Users, Settings, Sparkles, Filter, Plus, X, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts';
import { AIChatModal } from '../components/modals/AIChatModal';
import { homeData, dealsData } from '../data/mockData';

// Add custom styles for flip card and dial gauge
const styles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes dialPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const fmtMoney = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val);
};

interface HomePageProps {
  theme?: 'light' | 'dark';
}

export function HomePage({ theme = 'dark' }: HomePageProps) {
  const [timeFilter, setTimeFilter] = useState('90d');

  // Calculate active deals from dealsData
  const activeDealsCount = dealsData.deals.filter(d => d.status === 'active').length;

  // Financial goal
  const financialGoal = 150000;

  // Generate cash position data based on filter
  const getCashPositionData = () => {
    if (timeFilter === '30d') {
      return [
        { date: 'Feb 15', cash: 28000, taxVault: 7800, available: 20200 },
        { date: 'Feb 22', cash: 31500, taxVault: 8800, available: 22700 },
        { date: 'Mar 1', cash: 35000, taxVault: 9800, available: 25200 },
        { date: 'Mar 8', cash: 38200, taxVault: 10700, available: 27500 },
        { date: 'Mar 15', cash: 43600, taxVault: 12200, available: 31400 },
      ];
    } else if (timeFilter === 'YTD') {
      return [
        { date: 'Jan 1', cash: 12500, taxVault: 3500, available: 9000 },
        { date: 'Jan 15', cash: 18000, taxVault: 5040, available: 12960 },
        { date: 'Feb 1', cash: 24000, taxVault: 6720, available: 17280 },
        { date: 'Feb 15', cash: 28000, taxVault: 7840, available: 20160 },
        { date: 'Mar 1', cash: 35000, taxVault: 9800, available: 25200 },
        { date: 'Mar 15', cash: 43600, taxVault: 12208, available: 31392 },
      ];
    }
    // 90d default
    return [
      { date: 'Dec 15', cash: 8000, taxVault: 2240, available: 5760 },
      { date: 'Jan 1', cash: 12500, taxVault: 3500, available: 9000 },
      { date: 'Jan 15', cash: 18000, taxVault: 5040, available: 12960 },
      { date: 'Feb 1', cash: 24000, taxVault: 6720, available: 17280 },
      { date: 'Feb 15', cash: 28000, taxVault: 7840, available: 20160 },
      { date: 'Mar 1', cash: 35000, taxVault: 9800, available: 25200 },
      { date: 'Mar 15', cash: 43600, taxVault: 12208, available: 31392 },
    ];
  };

  const cashPositionData = getCashPositionData();

  // Memoize the chart to prevent re-renders
  const memoizedChart = useMemo(() => (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={cashPositionData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
        <XAxis dataKey="date" stroke="#737373" style={{ fontSize: '11px' }} />
        <YAxis stroke="#737373" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} style={{ fontSize: '11px' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px', fontSize: '12px' }}
          formatter={(value: any) => fmtMoney(value)}
          labelStyle={{ color: '#a3a3a3' }}
          itemSorter={(item: any) => {
            const order = { 'Total Cash': 1, 'Available': 2, 'Tax Vault': 3 };
            return order[item.name as keyof typeof order] || 99;
          }}
        />
        <ReferenceLine y={financialGoal} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Goal: $150k', position: 'right', fill: '#ef4444', fontSize: 11 }} />
        <Line type="monotone" dataKey="cash" stroke="#10b981" strokeWidth={2} dot={false} name="Total Cash" />
        <Line type="monotone" dataKey="available" stroke="#a855f7" strokeWidth={2} dot={false} name="Available" />
        <Line type="monotone" dataKey="taxVault" stroke="#3b82f6" strokeWidth={2} dot={false} name="Tax Vault" />
      </LineChart>
    </ResponsiveContainer>
  ), [cashPositionData, timeFilter, financialGoal]);

  // Calculate goal progress (no animation)
  const goalProgress = (cashPositionData[cashPositionData.length - 1].cash / financialGoal) * 100;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Theme-based styling
  const cardBg = theme === 'light' ? 'bg-white shadow-sm' : 'bg-neutral-900/40';
  const cardBorder = theme === 'light' ? 'border-gray-200' : 'border-neutral-800';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-neutral-100';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-neutral-400';
  const goalCardBg = theme === 'light' ? 'bg-emerald-50 shadow-sm' : 'bg-neutral-900/40';
  const goalCardBorder = theme === 'light' ? 'border-emerald-100' : 'border-neutral-800';

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className={`text-3xl font-semibold ${textPrimary}`}>{getGreeting()}, {homeData.athlete.firstName}</h1>
          <p className={`mt-1 text-base ${textSecondary}`}>
            You've earned {fmtMoney(homeData.kpis.totalEarned)} this year • {Math.round(homeData.kpis.taxRate * 100)}% saved for taxes
          </p>
        </div>
      </div>

      {/* KPI Cards - Compact */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className={`rounded-lg border ${cardBorder} ${cardBg} p-3`}>
          <div className={`text-xs ${textSecondary} mb-0.5`}>Total Earned</div>
          <div className={`text-xl font-semibold ${textPrimary} mb-0.5`}>{fmtMoney(homeData.kpis.totalEarned)}</div>
          <div className="text-xs text-emerald-400">+{Math.round(homeData.kpis.earnedMoM * 100)}% MoM</div>
        </div>

        <div className={`rounded-lg border ${cardBorder} ${cardBg} p-3`}>
          <div className={`text-xs ${textSecondary} mb-0.5`}>Tax Vault</div>
          <div className={`text-xl font-semibold ${textPrimary} mb-0.5`}>{fmtMoney(homeData.kpis.taxVault)}</div>
          <div className={`text-xs ${textSecondary}`}>{Math.round(homeData.kpis.taxRate * 100)}% saved</div>
        </div>

        <div className={`rounded-lg border ${cardBorder} ${cardBg} p-3`}>
          <div className={`text-xs ${textSecondary} mb-0.5`}>Available</div>
          <div className={`text-xl font-semibold ${textPrimary} mb-0.5`}>{fmtMoney(homeData.kpis.available)}</div>
          <div className={`text-xs ${textSecondary}`}>Safe to use</div>
        </div>

        <div className={`rounded-lg border ${cardBorder} ${cardBg} p-3`}>
          <div className={`text-xs ${textSecondary} mb-0.5`}>Active Deals</div>
          <div className={`text-xl font-semibold ${textPrimary} mb-0.5`}>{activeDealsCount}</div>
          <div className={`text-xs ${textSecondary}`}>Running</div>
        </div>
      </div>

      {/* Goal Progress Dial - Main Attraction */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Dial Gauge */}
        <div className={`col-span-2 rounded-lg border ${goalCardBorder} ${goalCardBg} p-4`}>
          <h2 className={`text-base font-semibold text-center mb-2 ${textPrimary}`}>Year-End Cash Goal</h2>

          {/* Dial Gauge */}
          <div className="flex flex-col items-center justify-center py-0">
            <div className="relative mb-3" style={{ width: '400px', height: '240px' }}>
              <svg className="absolute inset-0" viewBox="0 0 400 240">
                {/* Tick marks */}
                {Array.from({ length: 61 }).map((_, i) => {
                  const angle = 180 + (i * 180 / 60); // 180° to 360° (half circle)
                  const radius = 165;
                  const tickLength = i % 15 === 0 ? 12 : 6;
                  const x1 = 200 + (radius - tickLength) * Math.cos((angle * Math.PI) / 180);
                  const y1 = 195 + (radius - tickLength) * Math.sin((angle * Math.PI) / 180);
                  const x2 = 200 + radius * Math.cos((angle * Math.PI) / 180);
                  const y2 = 195 + radius * Math.sin((angle * Math.PI) / 180);

                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={theme === 'light' ? '#9ca3af' : '#525252'}
                      strokeWidth={i % 15 === 0 ? 2 : 1}
                    />
                  );
                })}

                {/* Background arc (grey) */}
                <path
                  d="M 35 195 A 165 165 0 0 1 365 195"
                  fill="none"
                  stroke={theme === 'light' ? '#e5e7eb' : '#262626'}
                  strokeWidth="30"
                />

                {/* Progress arc (emerald) */}
                <path
                  d={`M 35 195 A 165 165 0 ${goalProgress > 50 ? '1' : '0'} 1 ${
                    200 + 165 * Math.cos((180 + (goalProgress / 100 * 180)) * Math.PI / 180)
                  } ${
                    195 + 165 * Math.sin((180 + (goalProgress / 100 * 180)) * Math.PI / 180)
                  }`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="30"
                  strokeLinecap="butt"
                />

                {/* Percentage labels - positioned inside the dial */}
                <text x="70" y="200" fill={theme === 'light' ? '#6b7280' : '#737373'} fontSize="12" textAnchor="middle">0%</text>
                <text x="125" y="95" fill={theme === 'light' ? '#6b7280' : '#737373'} fontSize="12" textAnchor="middle">25%</text>
                <text x="275" y="95" fill={theme === 'light' ? '#6b7280' : '#737373'} fontSize="12" textAnchor="middle">75%</text>
                <text x="330" y="200" fill={theme === 'light' ? '#6b7280' : '#737373'} fontSize="12" textAnchor="middle">100%</text>
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '70px' }}>
                <div className="text-5xl font-bold text-emerald-400">{fmtMoney(cashPositionData[cashPositionData.length - 1].cash)}</div>
                <div className={`text-sm ${textSecondary} mt-1`}>of {fmtMoney(financialGoal)}</div>
              </div>
            </div>

            {/* Status text */}
            <div className="text-center text-neutral-400">
              <div className="text-base font-medium mb-1">Building momentum</div>
              <div className="text-sm">
                On pace to reach ~{fmtMoney(Math.round((cashPositionData[cashPositionData.length - 1].cash / 75) * 365))} by year-end
              </div>
            </div>

            {/* View strategy link */}
            <button className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View strategy →
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Upcoming & Obligations */}
          <div className={`flex-1 rounded-xl border ${cardBorder} ${cardBg} p-4 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${textPrimary}`}>Upcoming & Obligations</h2>
            </div>
            <div className="space-y-3 flex-1">
              {homeData.upcoming?.slice(0, 3).map((item: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between">
                  <div className={`text-sm ${textPrimary}`}>{item.label}</div>
                  <div className={`text-xs ${textSecondary}`}>{item.date}</div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              📋 View all
            </button>
          </div>

          {/* AI Insight */}
          <div className={`flex-1 rounded-xl border border-blue-900/40 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-950/30'} p-4 flex flex-col`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-blue-900' : 'text-emerald-400'}`}>AI Insight</h3>
            </div>
            <p className={`text-sm ${theme === 'light' ? 'text-blue-800' : 'text-neutral-300'} mb-3`}>
              You're on track to hit $65K by year-end. Based on your current pace, consider setting up quarterly tax payments to avoid a large year-end bill.
            </p>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-auto">
              Learn more about quarterly payments →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`col-span-2 rounded-xl border ${cardBorder} ${cardBg} p-4`}>
          <h2 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Recent Activity</h2>
          <div className="space-y-3">
            {homeData.recentActivity?.slice(0, 5).map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'income' ? 'bg-emerald-400' :
                    activity.type === 'expense' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <div className={`text-sm font-medium ${textPrimary}`}>{activity.label}</div>
                    <div className={`text-xs ${textSecondary}`}>{activity.date}</div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${
                  activity.amount >= 0 ? 'text-emerald-400' : textPrimary
                }`}>
                  {activity.amount >= 0 ? '+' : ''}{fmtMoney(activity.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border ${cardBorder} ${cardBg} p-4`}>
          <h2 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Quick Actions</h2>
          <div className="space-y-2">
            {homeData.quickActions?.map((action: any, idx: number) => (
              <button
                key={idx}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                  action.variant === 'primary'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : `${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100'}`
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
