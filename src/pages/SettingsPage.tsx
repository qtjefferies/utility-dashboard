import React, { useState } from 'react';
import { homeData } from '../data/mockData';
import { fmtMoney } from '../utils/formatters';

interface Deal {
  id: string;
  status: string;
}

interface SettingsPageProps {
  deals: Deal[];
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export function SettingsPage({ deals, theme = 'dark', onThemeChange }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dealReminders: true,
    taxAlerts: true,
    paymentNotifications: true,
    twoFactorEnabled: false,
    darkMode: true,
    taxRate: 28,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    language: 'en'
  });

  // Calculate active deals
  const activeDealsCount = deals.filter(d => d.status === 'active').length;
  const totalEarned = homeData.kpis.totalEarned;

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }));
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const setTheme = (isDark: boolean) => {
    updateSetting('darkMode', isDark);
    // Apply theme to body element
    if (isDark) {
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = '#e5e5e5';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#171717';
    }
  };

  const cardClass = theme === 'light' ? 'rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm' : 'rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-neutral-100';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-neutral-400';
  const textTertiary = theme === 'light' ? 'text-gray-500' : 'text-neutral-500';
  const borderClass = theme === 'light' ? 'border-emerald-100' : 'border-neutral-800';
  const inputBg = theme === 'light' ? 'bg-white' : 'bg-neutral-800';
  const inputBorder = theme === 'light' ? 'border-emerald-200' : 'border-neutral-700';
  const buttonBg = theme === 'light' ? 'bg-emerald-100 hover:bg-emerald-200 text-gray-700' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100';
  const innerCardBg = theme === 'light' ? 'bg-white/60' : 'bg-neutral-800/50';
  const sliderTrackBg = theme === 'light' ? '#d1fae5' : '#404040';
  const toggleOffBg = theme === 'light' ? 'bg-gray-300' : 'bg-neutral-700';

  return (
    <div className="px-10 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className={`text-3xl font-semibold ${textPrimary}`}>Settings</h1>
        <p className={`mt-1 text-sm ${textSecondary}`}>Manage your account and preferences</p>
      </div>

      <div className="space-y-4">
        {/* Profile Section */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Profile</h2>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className={`bg-emerald-600 h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ring-2 ${theme === 'light' ? 'ring-emerald-200' : 'ring-neutral-800'}`}>
                {homeData.athlete.initials}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-emerald-600 hover:bg-emerald-500 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${textPrimary}`}>{homeData.athlete.fullName}</h3>
              <p className={`text-sm ${textSecondary} mb-2`}>{homeData.athlete.sport} • {homeData.athlete.year}</p>
              <div className="flex gap-4 text-xs">
                <div>
                  <span className={textTertiary}>Active Deals</span>
                  <div className="text-base font-semibold text-emerald-500">{activeDealsCount}</div>
                </div>
                <div>
                  <span className={textTertiary}>Total Earned</span>
                  <div className="text-base font-semibold text-emerald-500">{fmtMoney(totalEarned)}</div>
                </div>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${buttonBg}`}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account & Security */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Account & Security</h2>
          <div className="space-y-3">
            <div className={`flex items-center justify-between pb-3 border-b ${borderClass}`}>
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Email Address</div>
                <div className={`text-xs ${textSecondary} flex items-center gap-2 mt-0.5`}>
                  marcus.thompson@university.edu
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">
                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${buttonBg}`}>
                Change
              </button>
            </div>

            <div className={`flex items-center justify-between pb-3 border-b ${borderClass}`}>
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Phone Number</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>(555) 123-4567</div>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${buttonBg}`}>
                Change
              </button>
            </div>

            <div className={`flex items-center justify-between pb-3 border-b ${borderClass}`}>
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Password</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>Last changed 3 months ago</div>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${buttonBg}`}>
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Two-Factor Authentication</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>Extra security layer</div>
              </div>
              <button
                onClick={() => toggleSetting('twoFactorEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorEnabled ? 'bg-emerald-600' : toggleOffBg
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Notifications</h2>
          <div className="space-y-3">
            <div className={`grid grid-cols-4 gap-3 pb-2 border-b ${borderClass}`}>
              <div className={`text-xs font-medium ${textSecondary}`}></div>
              <div className={`text-xs font-medium ${textSecondary} text-center`}>Email</div>
              <div className={`text-xs font-medium ${textSecondary} text-center`}>SMS</div>
              <div className={`text-xs font-medium ${textSecondary} text-center`}>Push</div>
            </div>

            {[
              { key: 'dealReminders', label: 'Deal Reminders', desc: 'Upcoming deal obligations' },
              { key: 'taxAlerts', label: 'Tax Deadline Alerts', desc: 'Quarterly tax reminders' },
              { key: 'paymentNotifications', label: 'Payment Received', desc: 'When payments arrive' }
            ].map(({ key, label, desc }) => (
              <div key={key} className={`grid grid-cols-4 gap-3 items-center pb-3 border-b last:border-0 last:pb-0 ${borderClass}`}>
                <div>
                  <div className={`text-sm font-medium ${textPrimary}`}>{label}</div>
                  <div className={`text-xs ${textSecondary} mt-0.5`}>{desc}</div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => toggleSetting('emailNotifications')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-emerald-600' : toggleOffBg
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => toggleSetting('smsNotifications')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.smsNotifications ? 'bg-emerald-600' : toggleOffBg
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        settings.smsNotifications ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => toggleSetting('pushNotifications')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.pushNotifications ? 'bg-emerald-600' : toggleOffBg
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        settings.pushNotifications ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Settings */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Financial Settings</h2>
          <div className="space-y-4">
            <div className={`pb-4 border-b ${borderClass}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className={`text-sm font-medium ${textPrimary}`}>Default Tax Withholding Rate</div>
                  <div className={`text-xs ${textSecondary} mt-0.5`}>Percentage automatically saved</div>
                </div>
                <div className="text-xl font-bold text-emerald-500">{settings.taxRate}%</div>
              </div>
              <input
                type="range"
                min="20"
                max="35"
                value={settings.taxRate}
                onChange={(e) => updateSetting('taxRate', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((settings.taxRate - 20) / 15) * 100}%, ${sliderTrackBg} ${((settings.taxRate - 20) / 15) * 100}%, ${sliderTrackBg} 100%)`
                }}
              />
              <div className={`flex justify-between text-xs ${textTertiary} mt-1`}>
                <span>20%</span>
                <span>35%</span>
              </div>
            </div>

            <div className={`pb-4 border-b ${borderClass}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className={`text-sm font-medium ${textPrimary}`}>Connected Bank Accounts</div>
                  <div className={`text-xs ${textSecondary} mt-0.5`}>Link bank for auto-tracking</div>
                </div>
                <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white transition-colors">
                  + Link Account
                </button>
              </div>
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 rounded-lg ${innerCardBg}`}>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      C
                    </div>
                    <div>
                      <div className={`text-xs font-medium ${textPrimary}`}>Chase Checking</div>
                      <div className={`text-xs ${textSecondary}`}>•••• 4567</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Connected
                    </span>
                    <button className={`${textSecondary} hover:text-red-500 text-xs transition-colors`}>
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm font-medium ${textPrimary}`}>Preferred Currency</div>
                  <div className={`text-xs ${textSecondary} mt-0.5`}>Display currency</div>
                </div>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  className={`px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-emerald-600 ${inputBg} ${inputBorder} ${textPrimary}`}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Connected Accounts</h2>
          <div className="space-y-2">
            {[
              { name: 'Instagram', icon: '📸', status: 'connected', username: '@marcusthompson' },
              { name: 'Twitter/X', icon: '𝕏', status: 'connected', username: '@mthompson23' },
              { name: 'TikTok', icon: '🎵', status: 'not_connected', username: null }
            ].map((account) => (
              <div key={account.name} className={`flex items-center justify-between p-3 rounded-lg ${innerCardBg}`}>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-base ${theme === 'light' ? 'bg-emerald-100' : 'bg-neutral-700'}`}>
                    {account.icon}
                  </div>
                  <div>
                    <div className={`text-xs font-medium ${textPrimary}`}>{account.name}</div>
                    {account.username && (
                      <div className={`text-xs ${textSecondary}`}>{account.username}</div>
                    )}
                  </div>
                </div>
                {account.status === 'connected' ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Connected
                    </span>
                    <button className={`${textSecondary} hover:text-red-500 text-xs transition-colors`}>
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${buttonBg}`}>
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Preferences</h2>
          <div className="space-y-3">
            <div className={`flex items-center justify-between pb-3 border-b ${borderClass}`}>
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Theme</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>Interface appearance</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSettings(prev => ({ ...prev, darkMode: true }));
                    onThemeChange?.('dark');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-emerald-600 text-white'
                      : theme === 'light' ? 'bg-emerald-100 text-gray-700 hover:bg-emerald-200' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  🌙 Dark
                </button>
                <button
                  onClick={() => {
                    setSettings(prev => ({ ...prev, darkMode: false }));
                    onThemeChange?.('light');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-emerald-600 text-white'
                      : theme === 'dark' ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-emerald-100 text-gray-700 hover:bg-emerald-200'
                  }`}
                >
                  ☀️ Light
                </button>
              </div>
            </div>

            <div className={`flex items-center justify-between pb-3 border-b ${borderClass}`}>
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Date Format</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>Date display format</div>
              </div>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value)}
                className={`px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-emerald-600 ${inputBg} ${inputBorder} ${textPrimary}`}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Language</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>Preferred language</div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className={`px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-emerald-600 ${inputBg} ${inputBorder} ${textPrimary}`}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className={cardClass}>
          <h2 className={`text-xl font-semibold mb-3 ${textPrimary}`}>Data & Privacy</h2>
          <div className="space-y-3">
            <div className={`flex items-center justify-between pb-3 border-b ${borderClass}`}>
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Export Your Data</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>Download all your data</div>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${buttonBg}`}>
                Export Data
              </button>
            </div>

            <div className={`flex items-center justify-between pb-3 border-b ${borderClass}`}>
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>Download Statements</div>
                <div className={`text-xs ${textSecondary} mt-0.5`}>PDF statements for taxes</div>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${buttonBg}`}>
                Download
              </button>
            </div>

            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-red-500">Delete Account</div>
                  <div className={`text-xs ${textSecondary} mt-0.5`}>Permanently delete account and all data</div>
                </div>
                <button className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 border border-red-600/50 hover:border-red-600 text-red-500 hover:text-white rounded-lg text-xs font-semibold transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
