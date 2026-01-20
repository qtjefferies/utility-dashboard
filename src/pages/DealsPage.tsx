import React, { useState } from 'react';
import { Plus, Filter, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '../utils/formatters';
import { FilterTab } from '../components/ui/FilterTab';
import { DealModal } from '../components/modals/DealModal';

interface Deal {
  id: string;
  status: string;
  dealName: string;
  source: string;
  amount: number;
  amountType: string;
  nextAction: string | null;
}

interface DealsPageProps {
  deals: Deal[];
  onUpdateDeal: (deal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
  onAddDeal: (deal: any) => void;
}

export function DealsPage({ deals, onUpdateDeal, onDeleteDeal, onAddDeal }: DealsPageProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    dealName: '',
    sources: [] as string[],
    minAmount: '',
    maxAmount: ''
  });

  const allSources = [...new Set(deals.map(d => d.source))];

  let filteredDeals = activeFilter === "all"
    ? deals
    : deals.filter(d => d.status === activeFilter);

  if (filters.dealName) {
    filteredDeals = filteredDeals.filter(d =>
      d.dealName.toLowerCase().includes(filters.dealName.toLowerCase())
    );
  }

  if (filters.sources.length > 0) {
    filteredDeals = filteredDeals.filter(d =>
      filters.sources.includes(d.source)
    );
  }

  if (filters.minAmount) {
    filteredDeals = filteredDeals.filter(d =>
      d.amount >= parseFloat(filters.minAmount)
    );
  }
  if (filters.maxAmount) {
    filteredDeals = filteredDeals.filter(d =>
      d.amount <= parseFloat(filters.maxAmount)
    );
  }

  // Apply sorting
  if (sortField) {
    filteredDeals = [...filteredDeals].sort((a, b) => {
      let aVal: any = a[sortField as keyof Deal];
      let bVal: any = b[sortField as keyof Deal];
      
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  const activeFiltersCount =
    (filters.dealName ? 1 : 0) +
    filters.sources.length +
    (filters.minAmount ? 1 : 0) +
    (filters.maxAmount ? 1 : 0);

  const counts = {
    all: deals.length,
    active: deals.filter(d => d.status === 'active').length,
    pending: deals.filter(d => d.status === 'pending').length,
    completed: deals.filter(d => d.status === 'completed').length
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 text-neutral-600" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-emerald-400" /> : 
      <ChevronDown className="h-4 w-4 text-emerald-400" />;
  };

  const clearFilters = () => {
    setFilters({
      dealName: '',
      sources: [],
      minAmount: '',
      maxAmount: ''
    });
  };

  const toggleSource = (source: string) => {
    setFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  return (
    <div className="px-10 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold">Deals & Income</h1>
          <p className="mt-2 text-base text-neutral-400">Track your NIL deals and payments</p>
        </div>
        <button
          onClick={() => setShowNewDealModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-base font-semibold"
        >
          <Plus className="h-5 w-5" />
          New Deal
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <FilterTab
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
            label={`All (${counts.all})`}
          />
          <FilterTab
            active={activeFilter === "active"}
            onClick={() => setActiveFilter("active")}
            label={`Active (${counts.active})`}
          />
          <FilterTab
            active={activeFilter === "pending"}
            onClick={() => setActiveFilter("pending")}
            label={`Pending (${counts.pending})`}
          />
          <FilterTab
            active={activeFilter === "completed"}
            onClick={() => setActiveFilter("completed")}
            label={`Completed (${counts.completed})`}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFiltersMenu(!showFiltersMenu)}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-lg text-sm border border-neutral-800 relative"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {showFiltersMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Deal Name
                  </label>
                  <input
                    type="text"
                    value={filters.dealName}
                    onChange={(e) => setFilters(prev => ({ ...prev, dealName: e.target.value }))}
                    placeholder="Search deals..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Source
                  </label>
                  <div className="space-y-2">
                    {allSources.map(source => (
                      <label key={source} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.sources.includes(source)}
                          onChange={() => toggleSource(source)}
                          className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0"
                        />
                        <span className="text-sm text-neutral-300">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Amount Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        value={filters.minAmount}
                        onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                        placeholder="Min"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={filters.maxAmount}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                        placeholder="Max"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <div className="text-sm text-neutral-400">
                    Showing {filteredDeals.length} of {deals.length} deals
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-8 py-4 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-neutral-300">
                  Status <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left px-8 py-4 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                <button onClick={() => handleSort('dealName')} className="flex items-center gap-1 hover:text-neutral-300">
                  Deal Name <SortIcon field="dealName" />
                </button>
              </th>
              <th className="text-left px-8 py-4 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                <button onClick={() => handleSort('source')} className="flex items-center gap-1 hover:text-neutral-300">
                  Source <SortIcon field="source" />
                </button>
              </th>
              <th className="text-left px-8 py-4 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                <button onClick={() => handleSort('amount')} className="flex items-center gap-1 hover:text-neutral-300">
                  Amount <SortIcon field="amount" />
                </button>
              </th>
              <th className="text-left px-8 py-4 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Next Action</th>
              <th className="text-left px-8 py-4 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-900/50">
                <td className="px-8 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(deal.status)}`}>
                    {getStatusLabel(deal.status)}
                  </span>
                </td>
                <td className="px-8 py-4 text-base font-medium text-neutral-100">{deal.dealName}</td>
                <td className="px-8 py-4 text-base text-neutral-300">{deal.source}</td>
                <td className="px-8 py-4 text-base font-semibold text-neutral-100">
                  ${deal.amount.toLocaleString()}{deal.amountType === "monthly" && "/mo"}
                </td>
                <td className="px-8 py-4 text-base text-neutral-400">{deal.nextAction || "—"}</td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingDeal(deal)}
                      className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-emerald-400 transition-colors"
                      title="Edit deal"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setDeletingDeal(deal)}
                      className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-red-400 transition-colors"
                      title="Delete deal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewDealModal && <DealModal onClose={() => setShowNewDealModal(false)} onSave={onAddDeal} />}
      {editingDeal && <DealModal deal={editingDeal} onClose={() => setEditingDeal(null)} onSave={onUpdateDeal} />}
      
      {/* Delete Confirmation */}
      {deletingDeal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Delete {deletingDeal.dealName}?</h3>
            <p className="text-neutral-400 mb-6">
              This deal will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingDeal(null)}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteDeal(deletingDeal.id);
                  setDeletingDeal(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showFiltersMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFiltersMenu(false)}
        />
      )}
    </div>
  );
}
