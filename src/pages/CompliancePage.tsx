import React from 'react';
import { CheckCircle, AlertTriangle, Clock, FileText, Shield, TrendingUp } from 'lucide-react';
import { homeData } from '../data/mockData';

export function CompliancePage() {
  const compliance = homeData.compliance;
  const isCompliant = compliance.status === 'all_clear';

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Compliance</h1>
        <p className="mt-1 text-base text-neutral-400">Stay compliant with NCAA and university regulations</p>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl border p-6 mb-6 ${
        isCompliant 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        <div className="flex items-start gap-4">
          {isCompliant ? (
            <CheckCircle className="h-8 w-8 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-amber-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h2 className={`text-xl font-semibold mb-2 ${
              isCompliant ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isCompliant ? 'All Clear!' : 'Action Required'}
            </h2>
            <p className="text-neutral-300">
              {isCompliant 
                ? 'You are fully compliant with all NCAA and university NIL regulations. Keep up the great work!'
                : 'You have pending compliance items that need your attention. Please review and complete them below.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Compliance Stats */}
        <div className="col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Deals Reported</div>
                  <div className="text-2xl font-semibold">{compliance.dealsReported}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Compliance Score</div>
                  <div className="text-2xl font-semibold text-emerald-400">100%</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Days Compliant</div>
                  <div className="text-2xl font-semibold">127</div>
                </div>
              </div>
            </div>
          </div>

          {/* Colorful Illustration */}
          <div className="rounded-xl border border-neutral-800 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 p-8">
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full max-w-md">
                {/* Background circles */}
                <circle cx="200" cy="150" r="120" fill="#10b981" opacity="0.1" />
                <circle cx="200" cy="150" r="90" fill="#3b82f6" opacity="0.1" />
                <circle cx="200" cy="150" r="60" fill="#8b5cf6" opacity="0.1" />
                
                {/* Shield */}
                <path
                  d="M200 50 L260 80 L260 140 Q260 180 200 220 Q140 180 140 140 L140 80 Z"
                  fill="#10b981"
                  opacity="0.9"
                />
                <path
                  d="M200 70 L245 95 L245 140 Q245 170 200 200 Q155 170 155 140 L155 95 Z"
                  fill="#059669"
                  opacity="0.9"
                />
                
                {/* Checkmark */}
                <path
                  d="M175 140 L190 160 L225 115"
                  stroke="#ffffff"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                
                {/* Stars/Sparkles */}
                <g fill="#fbbf24" opacity="0.8">
                  <circle cx="120" cy="100" r="4" />
                  <circle cx="280" cy="120" r="3" />
                  <circle cx="100" cy="180" r="3" />
                  <circle cx="300" cy="180" r="4" />
                  <circle cx="160" cy="60" r="3" />
                  <circle cx="240" cy="70" r="3" />
                </g>
                
                {/* Document icons floating around */}
                <g opacity="0.6">
                  {/* Left document */}
                  <rect x="80" y="130" width="30" height="40" rx="3" fill="#3b82f6" />
                  <line x1="85" y1="140" x2="105" y2="140" stroke="#ffffff" strokeWidth="2" />
                  <line x1="85" y1="150" x2="105" y2="150" stroke="#ffffff" strokeWidth="2" />
                  <line x1="85" y1="160" x2="100" y2="160" stroke="#ffffff" strokeWidth="2" />
                  
                  {/* Right document */}
                  <rect x="290" y="140" width="30" height="40" rx="3" fill="#8b5cf6" />
                  <line x1="295" y1="150" x2="315" y2="150" stroke="#ffffff" strokeWidth="2" />
                  <line x1="295" y1="160" x2="315" y2="160" stroke="#ffffff" strokeWidth="2" />
                  <line x1="295" y1="170" x2="310" y2="170" stroke="#ffffff" strokeWidth="2" />
                </g>
                
                {/* Bottom text */}
                <text x="200" y="260" textAnchor="middle" fill="#a3a3a3" fontSize="14" fontWeight="600">
                  Fully Compliant
                </text>
                <text x="200" y="280" textAnchor="middle" fill="#737373" fontSize="12">
                  All NIL deals properly reported
                </text>
              </svg>
            </div>
          </div>

          {/* Recent Compliance Activity */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Compliance Activity</h2>
            <div className="space-y-3">
              {[
                {
                  action: 'NIL Deal Reported',
                  description: 'Local Auto Dealership Social Posts',
                  date: 'Mar 15, 2025',
                  status: 'approved',
                  icon: CheckCircle,
                  color: 'text-emerald-400'
                },
                {
                  action: 'Quarterly Report Submitted',
                  description: 'Q1 2025 NIL Earnings Report',
                  date: 'Mar 10, 2025',
                  status: 'approved',
                  icon: FileText,
                  color: 'text-blue-400'
                },
                {
                  action: 'Deal Amendment Filed',
                  description: 'Conference Collective Monthly - Updated Terms',
                  date: 'Mar 5, 2025',
                  status: 'approved',
                  icon: CheckCircle,
                  color: 'text-emerald-400'
                },
                {
                  action: 'Compliance Training Completed',
                  description: 'NCAA NIL Guidelines 2025',
                  date: 'Feb 28, 2025',
                  status: 'completed',
                  icon: Shield,
                  color: 'text-purple-400'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-neutral-950/50 border border-neutral-800">
                  <div className={`h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-neutral-100">{item.action}</div>
                        <div className="text-xs text-neutral-400 mt-1">{item.description}</div>
                      </div>
                      <div className="text-xs text-neutral-500 whitespace-nowrap">{item.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-colors text-left flex items-center gap-3">
                <FileText className="h-4 w-4" />
                Report New Deal
              </button>
              <button className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-semibold transition-colors text-left flex items-center gap-3">
                <Clock className="h-4 w-4" />
                View Pending Items
              </button>
              <button className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-semibold transition-colors text-left flex items-center gap-3">
                <Shield className="h-4 w-4" />
                Compliance Resources
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {[
                { task: 'Q2 Earnings Report', due: 'Jun 15, 2025', priority: 'medium' },
                { task: 'Annual Compliance Review', due: 'Dec 31, 2025', priority: 'low' },
              ].map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Clock className={`h-4 w-4 mt-0.5 ${
                        item.priority === 'high' ? 'text-red-400' :
                        item.priority === 'medium' ? 'text-amber-400' :
                        'text-neutral-400'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-neutral-100">{item.task}</div>
                        <div className="text-xs text-neutral-400 mt-1">{item.due}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Tips */}
          <div className="rounded-xl border border-emerald-800/30 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 mb-2">Pro Tip</h3>
                <p className="text-xs text-neutral-300">
                  Report all NIL deals within 7 days of signing to maintain compliance. Use the "Report New Deal" button to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Compliance Officer */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-sm font-semibold mb-3">Need Help?</h2>
            <p className="text-xs text-neutral-400 mb-4">
              Contact your compliance officer if you have questions about NIL regulations.
            </p>
            <button className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold transition-colors">
              Contact Compliance Office
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
