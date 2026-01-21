import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { taxesData } from '../data/mockData';
import { fmtMoney } from '../utils/formatters';

interface TaxesPageProps {
  theme?: 'light' | 'dark';
  taxRate?: number;
  onTaxRateChange?: (rate: number) => void;
}

export function TaxesPage({ theme = 'dark', taxRate: propTaxRate = 0.28, onTaxRateChange }: TaxesPageProps) {
  const [selectedRate, setSelectedRate] = useState(propTaxRate);
  const [progressWidth, setProgressWidth] = useState(0);
  
  // Update local state when prop changes
  React.useEffect(() => {
    setSelectedRate(propTaxRate);
  }, [propTaxRate]);
  
  // Notify parent when rate changes
  const handleRateChange = (newRate: number) => {
    setSelectedRate(newRate);
    onTaxRateChange?.(newRate);
  };

  // Animate progress bar on mount with smooth transition
  useEffect(() => {
    const targetProgress = taxesData.taxVault.progressPercentage;
    
    // Start at 0
    setProgressWidth(0);
    
    // After a small delay, animate to target with CSS transition
    const timer = setTimeout(() => {
      setProgressWidth(targetProgress);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const getExplanation = () => {
    const perThousand = Math.round(selectedRate * 1000);
    const projectedAnnual = 65000;
    const totalSaved = Math.round(projectedAnnual * selectedRate);

    let billRange, status;
    if (selectedRate >= 0.32) {
      billRange = "$18,000–$20,000";
      status = `${totalSaved.toLocaleString()} (maximum protection)`;
    } else if (selectedRate >= 0.28) {
      billRange = "$18,500–$21,000";
      status = `${totalSaved.toLocaleString()} (on track)`;
    } else {
      billRange = "$19,000–$22,000";
      status = `${totalSaved.toLocaleString()} (potentially under-saving)`;
    }

    return { perThousand, billRange, status };
  };

  const explanation = getExplanation();

  // Theme-aware styles
  const cardBg = theme === 'light' ? 'bg-emerald-50 border-emerald-100' : 'bg-neutral-900/40 border-neutral-800';
  const innerCardBg = theme === 'light' ? 'bg-white border-emerald-100' : 'bg-neutral-950/40 border-neutral-800';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-neutral-100';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-neutral-400';
  const textMuted = theme === 'light' ? 'text-gray-500' : 'text-neutral-500';
  const progressTrack = theme === 'light' ? 'bg-emerald-100' : 'bg-neutral-800';
  const buttonStyle = theme === 'light'
    ? 'bg-white hover:bg-emerald-50 border-emerald-200 text-gray-700'
    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-100';
  const sliderTrackBg = theme === 'light' ? '#d1fae5' : '#404040';

  return (
    <div className="px-8 py-6">
      <div className="mb-4">
        <h1 className={`text-3xl font-semibold ${textPrimary}`}>Taxes & Vault</h1>
        <p className={`mt-1 text-base ${textSecondary}`}>Manage your tax savings strategy</p>
      </div>

      {/* Quarterly Payments KPIs */}
      <div className={`rounded-xl border ${cardBg} p-4 mb-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`text-lg font-semibold ${textPrimary}`}>Quarterly Payments</div>
          <button className={`${textMuted} hover:${textSecondary}`}>⋮</button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {taxesData.quarterlyPayments.map((payment) => (
            <div
              key={payment.id}
              className={`rounded-lg border ${innerCardBg} p-4`}
            >
              <div className={`text-xs ${textMuted} mb-1.5`}>{payment.quarter}</div>
              <div className={`text-xl font-semibold ${textPrimary} mb-1.5`}>{fmtMoney(payment.amount)}</div>
              <div className={`text-xs ${
                payment.status === "paid"
                  ? "text-emerald-500"
                  : payment.status === "due"
                  ? "text-amber-500"
                  : textMuted
              }`}>
                {payment.status === "paid" && `Paid ${payment.dueDate}`}
                {payment.status === "due" && `Due ${payment.dueDate}`}
                {payment.status === "estimated" && `Est. ${payment.dueDate}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`rounded-xl border ${cardBg} p-6 flex flex-col items-center justify-center`}>
          <div className="h-16 w-16 rounded-full bg-emerald-600/10 border-2 border-emerald-600/30 flex items-center justify-center mb-3">
            <DollarSign className="h-8 w-8 text-emerald-500" />
          </div>

          <div className={`text-4xl font-semibold mb-1 ${textPrimary}`}>{fmtMoney(taxesData.taxVault.currentAmount)}</div>
          <div className={`text-sm ${textSecondary} mb-4`}>Saved for taxes</div>

          <div className="w-full mb-4">
            <div className={`flex justify-between text-xs ${textSecondary} mb-1.5`}>
              <span>Progress</span>
              <span>{taxesData.taxVault.progressPercentage}% of goal</span>
            </div>
            <div className={`h-2 ${progressTrack} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-emerald-500 rounded-full transition-all ease-linear"
                style={{
                  width: `${progressWidth}%`,
                  transitionDuration: '1500ms'
                }}
              />
            </div>
            <p className={`text-xs ${textMuted} mt-1.5 text-center`}>{taxesData.taxVault.onTrackMessage}</p>
          </div>

          <button className={`w-full border px-4 py-2 rounded-lg text-sm font-medium ${buttonStyle}`}>
            Withdraw from vault
          </button>
        </div>

        <div className={`rounded-xl border ${cardBg} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-lg font-semibold ${textPrimary}`}>Your Strategy</div>
            <button className={`${textMuted} hover:${textSecondary}`}>⋮</button>
          </div>

          <div className="mb-4">
            <div className={`text-xs ${textSecondary} mb-2`}>Set-aside rate</div>
            <div className="relative">
              <input
                type="range"
                min={taxesData.strategy.minRate * 100}
                max={taxesData.strategy.maxRate * 100}
                value={selectedRate * 100}
                onChange={(e) => handleRateChange(parseFloat(e.target.value) / 100)}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((selectedRate - taxesData.strategy.minRate) / (taxesData.strategy.maxRate - taxesData.strategy.minRate)) * 100}%, ${sliderTrackBg} ${((selectedRate - taxesData.strategy.minRate) / (taxesData.strategy.maxRate - taxesData.strategy.minRate)) * 100}%, ${sliderTrackBg} 100%)`
                }}
              />
              <div className={`flex justify-between text-xs ${textMuted} mt-2`}>
                <span>{taxesData.strategy.minRate * 100}%</span>
                <span className="text-emerald-500 font-semibold">{Math.round(selectedRate * 100)}%</span>
                <span>{taxesData.strategy.maxRate * 100}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {taxesData.strategy.options.map((option) => {
              const isSelected = Math.abs(selectedRate - option.rate) < 0.01;
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedRate(option.rate)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? theme === 'light'
                        ? "border-2 border-emerald-500 bg-emerald-100/50"
                        : "border-2 border-emerald-600/50 bg-emerald-950/20"
                      : theme === 'light'
                        ? "border border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50"
                        : "border border-neutral-800 bg-neutral-900/50 hover:border-emerald-600/30 hover:bg-emerald-950/10"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500"
                        : theme === 'light' ? "border-gray-400" : "border-neutral-600"
                    }`}>
                      {isSelected && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${textPrimary}`}>{option.label}</div>
                      <div className={`text-xs ${isSelected ? "text-emerald-500" : textMuted}`}>
                        {option.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`rounded-lg border p-3 ${
            theme === 'light'
              ? 'border-blue-200 bg-blue-50'
              : 'border-blue-900/40 bg-blue-950/30'
          }`}>
            <div className={`text-sm font-semibold mb-1.5 ${theme === 'light' ? 'text-blue-900' : ''}`}>What this means:</div>
            <ul className={`space-y-1 text-xs ${theme === 'light' ? 'text-blue-800' : 'text-neutral-300'}`}>
              <li>• For every $1,000 you earn, ${explanation.perThousand} goes to your vault</li>
              <li>• Projected tax bill: {explanation.billRange}</li>
              <li>• You're saving: {explanation.status}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
