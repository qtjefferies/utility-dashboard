import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cashFlowData, categoryColorPalette } from '../data/mockData';
import { fmtMoney, getActivityDotColor } from '../utils/formatters';

interface CashFlowPageProps {
  theme?: 'light' | 'dark';
}

export function CashFlowPage({ theme = 'dark' }: CashFlowPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expenseDrilldownCategory, setExpenseDrilldownCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    dateRange: 'all' as 'all' | 'this_month' | 'last_month' | 'last_3_months' | 'custom',
    customStartDate: '',
    customEndDate: '',
    transactionType: 'all' as 'all' | 'income' | 'expense',
    categories: [] as string[],
    source: 'all' as 'all' | 'plaid' | 'manual'
  });

  const allCategories = [...new Set(cashFlowData.allTransactions.map(t => t.category))];

  // Helper function to check if date is in range
  const isInDateRange = (dateStr: string) => {
    if (filters.dateRange === 'all') return true;
    
    const txDate = new Date(dateStr);
    const today = new Date('2025-03-20'); // Current date in our demo
    
    if (filters.dateRange === 'this_month') {
      return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
    } else if (filters.dateRange === 'last_month') {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
    } else if (filters.dateRange === 'last_3_months') {
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      return txDate >= threeMonthsAgo;
    } else if (filters.dateRange === 'custom' && filters.customStartDate && filters.customEndDate) {
      const startDate = new Date(filters.customStartDate);
      const endDate = new Date(filters.customEndDate);
      return txDate >= startDate && txDate <= endDate;
    }
    return true;
  };

  // Apply all filters to transactions
  let filteredTransactions = cashFlowData.allTransactions.filter(tx => {
    // Date filter
    if (!isInDateRange(tx.date)) return false;
    
    // Transaction type filter
    if (filters.transactionType !== 'all' && tx.type !== filters.transactionType) return false;
    
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(tx.category)) return false;
    
    return true;
  });

  // Calculate filtered summary stats
  const filteredSummary = {
    totalIncome: filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    netCashFlow: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
    taxesSaved: cashFlowData.summary.taxesSaved // This stays constant
  };

  // Calculate filtered monthly trend
  const monthlyMap: Record<string, { month: string; income: number; expenses: number; net: number }> = {};
  filteredTransactions.forEach(tx => {
    if (!monthlyMap[tx.month]) {
      monthlyMap[tx.month] = { month: tx.month, income: 0, expenses: 0, net: 0 };
    }
    if (tx.amount > 0) {
      monthlyMap[tx.month].income += tx.amount;
    } else {
      monthlyMap[tx.month].expenses += Math.abs(tx.amount);
    }
    monthlyMap[tx.month].net += tx.amount;
  });
  
  const monthOrder = ['Jan', 'Feb', 'Mar'];
  const filteredMonthlyTrend = monthOrder
    .map(month => monthlyMap[month] || { month, income: 0, expenses: 0, net: 0 })
    .filter(m => m.income > 0 || m.expenses > 0);

  // Calculate filtered expenses by category
  const expenseCategoryMap: Record<string, number> = {};
  filteredTransactions
    .filter(t => t.amount < 0)
    .forEach(t => {
      if (!expenseCategoryMap[t.category]) {
        expenseCategoryMap[t.category] = 0;
      }
      expenseCategoryMap[t.category] += Math.abs(t.amount);
    });
  
  const filteredExpensesByCategory = Object.entries(expenseCategoryMap).map(([name, value], index) => {
    const predefinedCategory = cashFlowData.expensesByCategory.find(c => c.name === name);
    const color = predefinedCategory?.color || categoryColorPalette[index % categoryColorPalette.length];
    return { name, value, color };
  });

  // Helper function to truncate long labels
  const truncateLabel = (label: string, maxWords: number = 2): string => {
    const words = label.split(' ');
    if (words.length <= maxWords) return label;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Calculate drilldown expenses for selected category
  const expenseDrilldownData = expenseDrilldownCategory
    ? filteredTransactions
        .filter(t => t.category === expenseDrilldownCategory && t.amount < 0)
        .map((t, index) => ({
          name: truncateLabel(t.description, 2),
          fullName: t.description,
          value: Math.abs(t.amount),
          color: categoryColorPalette[index % categoryColorPalette.length]
        }))
    : [];

  // Determine which data to show in the expense chart
  const expenseChartData = expenseDrilldownCategory ? expenseDrilldownData : filteredExpensesByCategory;

  // Calculate filtered income by source
  const incomeSourceMap: Record<string, number> = {};
  filteredTransactions
    .filter(t => t.amount > 0)
    .forEach(t => {
      // Map categories to source names for display
      let sourceName = t.category;
      if (t.category === 'Collective') sourceName = 'Collectives';
      if (t.category === 'Brand Deal') sourceName = 'Brand Deals';
      if (t.category === 'Social Media') sourceName = 'Social Media';
      if (t.category === 'Appearance Fees') sourceName = 'Appearance Fees';
      if (t.category === 'Merchandise') sourceName = 'Merchandise';

      if (!incomeSourceMap[sourceName]) {
        incomeSourceMap[sourceName] = 0;
      }
      incomeSourceMap[sourceName] += t.amount;
    });
  
  const filteredIncomeBySource = Object.entries(incomeSourceMap).map(([name, value], index) => {
    const predefinedSource = cashFlowData.incomeBySource.find(s => s.name === name);
    const color = predefinedSource?.color || categoryColorPalette[index % categoryColorPalette.length];
    return { name, value, color };
  });

  // Count active filters
  const activeFiltersCount = 
    (filters.dateRange !== 'all' ? 1 : 0) +
    (filters.transactionType !== 'all' ? 1 : 0) +
    filters.categories.length +
    (filters.source !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
      transactionType: 'all',
      categories: [],
      source: 'all'
    });
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleBarClick = (data: any) => {
    setSelectedCategory(data.name);
  };

  const handlePieClick = (data: any) => {
    // Map income source names to transaction category names
    const categoryMap: Record<string, string> = {
      'Collectives': 'Collective',
      'Brand Deals': 'Brand Deal',
      'Social Media': 'Social Media',
      'Appearance Fees': 'Appearance Fees',
      'Merchandise': 'Merchandise'
    };
    const mappedCategory = categoryMap[data.name] || data.name;
    setSelectedCategory(mappedCategory);
  };

  const categoryTransactions = selectedCategory
    ? filteredTransactions.filter(t => {
        // Check if it's an income category (mapped names)
        const incomeCategories = ['Collective', 'Brand Deal', 'Social Media', 'Appearance Fees', 'Merchandise'];
        const expenseCategories = ['Business', 'Travel', 'Equipment'];

        if (incomeCategories.includes(selectedCategory)) {
          return t.category === selectedCategory && t.amount > 0;
        } else if (expenseCategories.includes(selectedCategory)) {
          return t.category === selectedCategory && t.amount < 0;
        }
        return false;
      })
    : [];

  // Theme-aware styles
  const cardBg = theme === 'light' ? 'bg-emerald-50 border-emerald-100' : 'bg-neutral-900/40 border-neutral-800';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-neutral-100';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-neutral-400';
  const textMuted = theme === 'light' ? 'text-gray-500' : 'text-neutral-500';
  const buttonStyle = theme === 'light'
    ? 'bg-white hover:bg-emerald-50 border-emerald-200 text-gray-700'
    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300';
  const dropdownBg = theme === 'light'
    ? 'bg-white border-emerald-200'
    : 'bg-neutral-900 border-neutral-800';
  const inputStyle = theme === 'light'
    ? 'bg-emerald-50 border-emerald-200 text-gray-900'
    : 'bg-neutral-950 border-neutral-800 text-neutral-100';
  const labelStyle = theme === 'light' ? 'text-gray-700' : 'text-neutral-300';
  const chartGridColor = theme === 'light' ? '#d1fae5' : '#404040';
  const chartAxisColor = theme === 'light' ? '#6b7280' : '#737373';
  const tooltipBg = theme === 'light' ? '#ffffff' : '#171717';
  const tooltipBorder = theme === 'light' ? '#d1fae5' : '#404040';

  return (
    <div className="px-8 py-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className={`text-3xl font-semibold ${textPrimary}`}>Cash Flow</h1>
          <p className={`mt-1 text-base ${textSecondary}`}>Track your income, expenses, and net cash flow</p>
        </div>
        
        {/* Filters Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border relative ${buttonStyle}`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {showFilters && (
            <div className={`absolute right-0 top-full mt-2 w-96 border rounded-xl shadow-2xl z-50 ${dropdownBg}`}>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${textPrimary}`}>Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-emerald-600 hover:text-emerald-500"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className={`block text-sm font-medium ${labelStyle} mb-2`}>
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 ${inputStyle}`}
                  >
                    <option value="all">All Time</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="last_3_months">Last 3 Months</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  {filters.dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <input
                        type="date"
                        value={filters.customStartDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, customStartDate: e.target.value }))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 ${inputStyle}`}
                        placeholder="Start date"
                      />
                      <input
                        type="date"
                        value={filters.customEndDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, customEndDate: e.target.value }))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 ${inputStyle}`}
                        placeholder="End date"
                      />
                    </div>
                  )}
                </div>

                {/* Transaction Type Filter */}
                <div>
                  <label className={`block text-sm font-medium ${labelStyle} mb-2`}>
                    Transaction Type
                  </label>
                  <select
                    value={filters.transactionType}
                    onChange={(e) => setFilters(prev => ({ ...prev, transactionType: e.target.value as any }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 ${inputStyle}`}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expenses Only</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium ${labelStyle} mb-2`}>
                    Categories
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allCategories.map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className={`w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0 ${
                            theme === 'light' ? 'border-emerald-300 bg-white' : 'border-neutral-700 bg-neutral-950'
                          }`}
                        />
                        <span className={`text-sm ${labelStyle}`}>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Source Filter */}
                <div>
                  <label className={`block text-sm font-medium ${labelStyle} mb-2`}>
                    Source
                  </label>
                  <select
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value as any }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 ${inputStyle}`}
                  >
                    <option value="all">All Sources</option>
                    <option value="plaid">Bank (Plaid)</option>
                    <option value="manual">Manual Entry</option>
                  </select>
                </div>

                <div className={`pt-4 border-t ${theme === 'light' ? 'border-emerald-200' : 'border-neutral-800'}`}>
                  <div className={`text-sm ${textSecondary}`}>
                    Showing {filteredTransactions.length} transactions
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl border ${cardBg} p-4`}>
          <div className={`text-xs ${textSecondary} mb-1`}>Total Income</div>
          <div className="text-2xl font-semibold text-emerald-500">{fmtMoney(filteredSummary.totalIncome)}</div>
        </div>
        <div className={`rounded-xl border ${cardBg} p-4`}>
          <div className={`text-xs ${textSecondary} mb-1`}>Total Expenses</div>
          <div className="text-2xl font-semibold text-red-500">{fmtMoney(filteredSummary.totalExpenses)}</div>
        </div>
        <div className={`rounded-xl border ${cardBg} p-4`}>
          <div className={`text-xs ${textSecondary} mb-1`}>Net Cash Flow</div>
          <div className={`text-2xl font-semibold ${textPrimary}`}>{fmtMoney(filteredSummary.netCashFlow)}</div>
        </div>
        <div className={`rounded-xl border ${cardBg} p-4`}>
          <div className={`text-xs ${textSecondary} mb-1`}>Taxes Saved</div>
          <div className="text-2xl font-semibold text-blue-500">{fmtMoney(filteredSummary.taxesSaved)}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-4 mt-8" style={{ gridAutoRows: '1fr' }}>
        {/* Income by Source */}
        <div className={`rounded-xl border ${cardBg} p-4 flex flex-col min-h-0`}>
          <h2 className={`text-lg font-semibold mb-3 ${textPrimary}`}>Money Coming In (Income)</h2>
          {filteredIncomeBySource.length > 0 ? (
            <div className="flex items-center gap-6 flex-1 min-h-0">
              {/* Donut Chart */}
              <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '45%', maxWidth: '200px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={160} maxHeight={240}>
                  <PieChart>
                    <Pie
                      data={filteredIncomeBySource}
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="85%"
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                      cursor="pointer"
                      onClick={handlePieClick}
                    >
                      {filteredIncomeBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div style={{
                              backgroundColor: tooltipBg,
                              border: `1px solid ${tooltipBorder}`,
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              color: theme === 'light' ? '#111827' : '#ffffff'
                            }}>
                              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                {payload[0].name}
                              </div>
                              <div>
                                {fmtMoney(payload[0].value)}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend with Progress Bars */}
              <div className="flex-1 flex flex-col justify-center" style={{ gap: `${Math.max(10, 28 - filteredIncomeBySource.length * 2)}px` }}>
                {(() => {
                  const total = filteredIncomeBySource.reduce((sum, item) => sum + item.value, 0);
                  return filteredIncomeBySource.map((source, index) => {
                    const percentage = ((source.value / total) * 100).toFixed(1);
                    return (
                      <div key={index} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="h-3.5 w-3.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: source.color }}
                            />
                            <span className={`text-sm font-medium truncate ${textPrimary}`}>{source.name}</span>
                          </div>
                          <span className={`text-sm font-semibold ml-3 ${textSecondary}`}>{percentage}%</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-emerald-100' : 'bg-neutral-800'}`}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: source.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex items-center justify-center text-sm ${textMuted}`}>
              No income data for selected filters
            </div>
          )}
          {filteredIncomeBySource.length > 0 && (
            <p className={`text-xs ${textMuted} mt-3 text-center`}>Click the chart to see transaction details</p>
          )}
        </div>

        {/* Expenses by Category */}
        <div className={`rounded-xl border ${cardBg} p-4 flex flex-col min-h-0 ${expenseDrilldownCategory ? 'pb-8' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${textPrimary}`}>
              {expenseDrilldownCategory ? `${expenseDrilldownCategory} Expenses` : 'Money Going Out (Expenses)'}
            </h2>
            {expenseDrilldownCategory && (
              <button
                onClick={() => setExpenseDrilldownCategory(null)}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                ← Back to Categories
              </button>
            )}
          </div>
          {expenseChartData.length > 0 ? (
            <div className="flex-1 min-h-0 flex flex-col overflow-visible">
              <ResponsiveContainer width="100%" height="100%" minHeight={180} maxHeight={260}>
                <BarChart
                  data={expenseChartData}
                  margin={{ top: 5, right: 10, left: 5, bottom: expenseDrilldownCategory ? 45 : 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis
                    dataKey="name"
                    stroke={chartAxisColor}
                    style={{ fontSize: expenseDrilldownCategory ? '10px' : '11px' }}
                    interval={0}
                    angle={expenseDrilldownCategory ? -45 : 0}
                    textAnchor={expenseDrilldownCategory ? "end" : "middle"}
                    height={expenseDrilldownCategory ? 70 : 30}
                  />
                  <YAxis stroke={chartAxisColor} tickFormatter={(value) => `$${value.toLocaleString()}`} style={{ fontSize: '11px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', fontSize: '12px', color: theme === 'light' ? '#111827' : '#ffffff' }}
                    itemStyle={{ color: theme === 'light' ? '#111827' : '#ffffff' }}
                    labelStyle={{ color: theme === 'light' ? '#111827' : '#ffffff' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                    labelFormatter={(label: string) => {
                      // Show full name in tooltip if available
                      const entry = expenseChartData.find((e: any) => e.name === label);
                      return entry?.fullName || label;
                    }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar
                    dataKey="value"
                    cursor={!expenseDrilldownCategory ? "pointer" : "default"}
                    onClick={(data: any) => {
                      if (!expenseDrilldownCategory) {
                        setExpenseDrilldownCategory(data.name);
                      }
                    }}
                    activeBar={false}
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {!expenseDrilldownCategory && (
                <p className={`text-xs ${textMuted} mt-3 text-center`}>Click a bar to drill down into individual expenses</p>
              )}
            </div>
          ) : (
            <div className={`flex-1 flex items-center justify-center text-sm ${textMuted}`}>
              No expense data for selected filters
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions - Full Width */}
      <div className={`rounded-xl border ${cardBg} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${textPrimary}`}>Recent Transactions</h2>
          <button className="text-xs text-emerald-600 hover:text-emerald-500">View all</button>
        </div>
        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {filteredTransactions.slice(-10).reverse().map((tx) => {
              // Format date as "Mar 8"
              const dateObj = new Date(tx.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={tx.id} className={`flex items-center justify-between pb-3 border-b ${theme === 'light' ? 'border-emerald-100' : 'border-neutral-800'}`}>
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-1 h-2 w-2 rounded-full ${getActivityDotColor(tx.type)}`} />
                    <div>
                      <div className={`text-xs font-medium ${textPrimary}`}>{tx.description}</div>
                      <div className={`text-xs ${textMuted}`}>{tx.category} • {formattedDate}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${tx.amount >= 0 ? "text-emerald-500" : textSecondary}`}>
                    {tx.amount >= 0 ? `+${fmtMoney(tx.amount)}` : fmtMoney(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`h-[180px] flex items-center justify-center text-sm ${textMuted}`}>
            No transactions for selected filters
          </div>
        )}
      </div>

      {/* Income Source Drill-down Modal */}
      {selectedCategory && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setSelectedCategory(null)}
          />
          <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden flex flex-col ${
            theme === 'light' ? 'bg-white border border-emerald-200' : 'bg-neutral-900 border border-neutral-800'
          }`}>
            <div className={`p-6 border-b flex items-center justify-between ${
              theme === 'light' ? 'border-emerald-100' : 'border-neutral-800'
            }`}>
              <div>
                <h3 className={`text-xl font-semibold ${textPrimary}`}>{selectedCategory} Transactions</h3>
                <p className={`text-sm mt-1 ${textSecondary}`}>
                  {categoryTransactions.length} transaction{categoryTransactions.length !== 1 ? 's' : ''} • Total: {fmtMoney(categoryTransactions.reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-2xl leading-none ${theme === 'light' ? 'text-gray-400 hover:text-gray-700' : 'text-neutral-400 hover:text-neutral-100'}`}
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {categoryTransactions.length > 0 ? (
                <div className="space-y-3">
                  {categoryTransactions.map((tx, idx) => {
                    const txDate = new Date(tx.date);
                    const formattedDate = `${txDate.toLocaleDateString('en-US', { month: 'short' })} ${txDate.getDate()}`;

                    return (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
                        theme === 'light' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-neutral-950/50 border-neutral-800'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className={`h-2 w-2 rounded-full ${getActivityDotColor(tx.type)}`} />
                          <div>
                            <div className={`text-sm font-medium ${textPrimary}`}>{tx.description}</div>
                            <div className={`text-xs ${textMuted}`}>{tx.category} • {formattedDate}</div>
                          </div>
                        </div>
                        <div className={`text-base font-semibold ${tx.amount >= 0 ? "text-emerald-500" : textSecondary}`}>
                          {tx.amount >= 0 ? `+${fmtMoney(tx.amount)}` : fmtMoney(tx.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`py-12 text-center ${textMuted}`}>
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Filter backdrop */}
      {showFilters && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
