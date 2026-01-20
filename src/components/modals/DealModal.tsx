import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DealModalProps {
  deal?: {
    id: string;
    status: string;
    dealName: string;
    source: string;
    amount: number;
    amountType: string;
    nextAction: string | null;
  };
  onClose: () => void;
  onSave: (deal: any) => void;
}

export function DealModal({ deal, onClose, onSave }: DealModalProps) {
  const isEditing = !!deal;
  const [formData, setFormData] = useState({
    status: deal?.status || 'pending',
    dealName: deal?.dealName || '',
    source: deal?.source || '',
    amount: deal?.amount || '',
    amountType: deal?.amountType || 'one-time',
    nextAction: deal?.nextAction || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    console.log('🚀 DEAL FORM SUBMIT TRIGGERED');
    console.log('📝 Deal form data:', formData);

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.dealName.trim()) newErrors.dealName = 'Deal name is required';
    if (!formData.source) newErrors.source = 'Source is required';
    if (!formData.amount || parseFloat(formData.amount.toString()) <= 0) newErrors.amount = 'Valid amount is required';

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ VALIDATION FAILED:', newErrors);
      setErrors(newErrors);
      return;
    }

    console.log('✅ VALIDATION PASSED');

    const dealData = { ...formData, amount: parseFloat(formData.amount.toString()) };

    console.log('💾 Calling onSave with:', dealData);

    if (isEditing) {
      onSave({ ...deal, ...dealData });
    } else {
      onSave(dealData);
    }

    console.log('🎉 Deal saved successfully!');
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800">
          <h2 className="text-2xl font-semibold">{isEditing ? 'Edit Deal' : 'New Deal'}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Status */}
            <div>
              <label htmlFor="deal-status" className="block text-sm font-medium text-neutral-300 mb-2">
                Status
              </label>
              <select
                id="deal-status"
                name="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Deal Name */}
            <div>
              <label htmlFor="deal-name" className="block text-sm font-medium text-neutral-300 mb-2">
                Deal Name
              </label>
              <input
                type="text"
                id="deal-name"
                name="dealName"
                value={formData.dealName}
                onChange={(e) => handleChange('dealName', e.target.value)}
                placeholder="e.g., Local Restaurant Partnership"
                className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-base text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 ${
                  errors.dealName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-neutral-800 focus:border-emerald-600 focus:ring-emerald-600'
                }`}
              />
              {errors.dealName && <p className="text-xs text-red-400 mt-1">{errors.dealName}</p>}
            </div>

            {/* Source */}
            <div>
              <label htmlFor="deal-source" className="block text-sm font-medium text-neutral-300 mb-2">
                Source
              </label>
              <select
                id="deal-source"
                name="source"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-base text-neutral-100 focus:outline-none focus:ring-1 ${
                  errors.source
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-neutral-800 focus:border-emerald-600 focus:ring-emerald-600'
                }`}
              >
                <option value="">Select source...</option>
                <option value="Brand Direct">Brand Direct</option>
                <option value="Collective">Collective</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Agent">Agent</option>
                <option value="Other">Other</option>
              </select>
              {errors.source && <p className="text-xs text-red-400 mt-1">{errors.source}</p>}
            </div>

            {/* Amount & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="deal-amount" className="block text-sm font-medium text-neutral-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                  <input
                    type="number"
                    id="deal-amount"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0"
                    className={`w-full bg-neutral-950 border rounded-xl pl-8 pr-4 py-3 text-base text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 ${
                      errors.amount
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-neutral-800 focus:border-emerald-600 focus:ring-emerald-600'
                    }`}
                  />
                </div>
                {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
              </div>
              <div>
                <label htmlFor="deal-amount-type" className="block text-sm font-medium text-neutral-300 mb-2">
                  Type
                </label>
                <select
                  id="deal-amount-type"
                  name="amountType"
                  value={formData.amountType}
                  onChange={(e) => handleChange('amountType', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Next Action */}
            <div>
              <label htmlFor="deal-next-action" className="block text-sm font-medium text-neutral-300 mb-2">
                Next Action
              </label>
              <input
                type="text"
                id="deal-next-action"
                name="nextAction"
                value={formData.nextAction}
                onChange={(e) => handleChange('nextAction', e.target.value)}
                placeholder="e.g., Sign contract, Post content"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-6 py-3 rounded-xl text-base font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-base font-semibold transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Deal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
