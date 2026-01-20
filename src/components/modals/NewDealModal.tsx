import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NewDealModalProps {
  onClose: () => void;
}

export function NewDealModal({ onClose }: NewDealModalProps) {
  const [formData, setFormData] = useState({
    status: 'pending',
    dealName: '',
    source: '',
    amount: '',
    nextAction: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New deal submitted:', formData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800">
          <h2 className="text-2xl font-semibold">New Deal</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Deal Name
              </label>
              <input
                type="text"
                value={formData.dealName}
                onChange={(e) => handleChange('dealName', e.target.value)}
                placeholder="e.g., Local Restaurant Partnership"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              >
                <option value="">Select source...</option>
                <option value="Brand Direct">Brand Direct</option>
                <option value="Collective">Collective</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Agent">Agent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-4 py-3 text-base text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Next Action
              </label>
              <input
                type="text"
                value={formData.nextAction}
                onChange={(e) => handleChange('nextAction', e.target.value)}
                placeholder="e.g., Sign contract, Post content"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-6 py-3 rounded-xl text-base font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-base font-semibold transition-colors"
            >
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
