import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { fmtMoney } from '../../utils/formatters';

interface Transaction {
  id: string;
  type: string;
  category: string;
  description: string;
  date: string;
  month: string;
  amount: number;
}

interface CategoryDrilldownModalProps {
  category: string;
  transactions: Transaction[];
  onClose: () => void;
}

export function CategoryDrilldownModal({ category, transactions, onClose }: CategoryDrilldownModalProps) {
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  let sortedTransactions = [...transactions];

  sortedTransactions.sort((a, b) => {
    let aVal: any = sortField === 'date' ? new Date(a.date) : Math.abs(a.amount);
    let bVal: any = sortField === 'date' ? new Date(b.date) : Math.abs(b.amount);

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const avgAmount = transactions.length > 0 ? totalAmount / transactions.length : 0;

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl font-semibold">{category} Expenses</h2>
            <p className="text-sm text-neutral-400 mt-1">{transactions.length} transactions • {fmtMoney(totalAmount)} total</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 px-8 py-4 bg-neutral-950/40 border-b border-neutral-800">
          <div>
            <div className="text-sm text-neutral-400">Total Spent</div>
            <div className="text-xl font-semibold text-red-400">{fmtMoney(totalAmount)}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Transactions</div>
            <div className="text-xl font-semibold">{transactions.length}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Average</div>
            <div className="text-xl font-semibold">{fmtMoney(avgAmount)}</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="rounded-xl border border-neutral-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-950/60 sticky top-0">
                <tr>
                  <th
                    onClick={() => handleSort('date')}
                    className="text-left px-4 py-3 text-xs uppercase tracking-wide text-neutral-400 font-semibold cursor-pointer hover:text-neutral-200"
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === 'date' && (
                        sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-neutral-400 font-semibold">
                    Description
                  </th>
                  <th
                    onClick={() => handleSort('amount')}
                    className="text-right px-4 py-3 text-xs uppercase tracking-wide text-neutral-400 font-semibold cursor-pointer hover:text-neutral-200"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      {sortField === 'amount' && (
                        sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((tx) => {
                  const dateObj = new Date(tx.date);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <tr key={tx.id} className="border-t border-neutral-800 hover:bg-neutral-900/50">
                      <td className="px-4 py-3 text-sm text-neutral-400">{formattedDate}</td>
                      <td className="px-4 py-3 text-base text-neutral-100">{tx.description}</td>
                      <td className="px-4 py-3 text-base font-semibold text-right text-red-400">
                        {fmtMoney(Math.abs(tx.amount))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-6 py-3 rounded-xl text-base font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
