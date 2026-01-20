import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, FileText, Shield, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { homeData } from '../data/mockData';

interface CompliancePageProps {
  theme?: 'light' | 'dark';
  complianceItems: Array<{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'overdue' | 'pending' | 'completed';
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
  onMarkComplete: (itemId: string) => void;
}

export function CompliancePage({ complianceItems, onMarkComplete }: CompliancePageProps) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);

  // Count items by status
  const overdueCount = complianceItems?.filter(item => item.status === 'overdue').length || 0;
  const pendingCount = complianceItems?.filter(item => item.status === 'pending').length || 0;
  const completedCount = complianceItems?.filter(item => item.status === 'completed').length || 0;
  const totalItems = complianceItems?.length || 0;
  const isCompliant = overdueCount + pendingCount === 0;

  // Auto-collapse dropdown when all items are completed
  useEffect(() => {
    if (isCompliant && isItemsExpanded) {
      setIsItemsExpanded(false);
    }
  }, [isCompliant, isItemsExpanded]);

  // Calculate compliance score
  const complianceScore = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 100;

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

      {/* KPIs Row - Full Width */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Deals Reported</div>
                  <div className="text-2xl font-semibold">{homeData.compliance.dealsReported}</div>
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
                  <div className={`text-2xl font-semibold ${
                    complianceScore === 100 ? 'text-emerald-400' : complianceScore >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {complianceScore}%
                  </div>
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
      </div>

      {/* Compliance Items Row - Full Width */}
      <div className="mb-6">
        <div className="space-y-3">
          {/* Compliance Items Dropdown */}
          {complianceItems && complianceItems.length > 0 && (
            <div>
              <button
                onClick={() => setIsItemsExpanded(!isItemsExpanded)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors mb-3"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">Compliance Items</h2>
                  <div className="flex items-center gap-2">
                    {overdueCount > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-semibold">
                        {overdueCount} Overdue
                      </span>
                    )}
                    {pendingCount > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                        {pendingCount} Pending
                      </span>
                    )}
                    {completedCount > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                        {completedCount} Completed
                      </span>
                    )}
                  </div>
                </div>
                {isItemsExpanded ? (
                  <ChevronUp className="h-5 w-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-neutral-400" />
                )}
              </button>

              {isItemsExpanded && (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {complianceItems
                    .filter(item => item.status !== 'completed')
                    .map((item, index) => (
                    <div
                      key={item.id}
                      style={{ animationDelay: `${index * 150}ms` }}
                      className={`rounded-xl border p-4 animate-fade-slide-in ${
                        item.status === 'overdue'
                          ? 'bg-red-500/10 border-red-500/30'
                          : item.status === 'pending'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-emerald-500/10 border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {item.status === 'overdue' ? (
                            <AlertCircle className="h-6 w-6 text-red-400" />
                          ) : item.status === 'pending' ? (
                            <Clock className="h-6 w-6 text-amber-400" />
                          ) : (
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1 gap-3">
                            <h3 className="font-semibold text-neutral-100">{item.title}</h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  item.priority === 'high'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}
                              >
                                {item.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                              </span>
                              {item.status !== 'completed' && (
                                <button
                                  onClick={() => onMarkComplete(item.id)}
                                  className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-400 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-xs text-neutral-500">
                            <span>Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="capitalize">{item.category}</span>
                            <span
                              className={`font-semibold ${
                                item.status === 'overdue'
                                  ? 'text-red-400'
                                  : item.status === 'pending'
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {item.status === 'overdue' ? 'OVERDUE' : item.status === 'pending' ? 'PENDING' : 'COMPLETED'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Action Required + Quick Actions + Upcoming Deadlines Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Compliance Visual - Left 2/3 */}
        <div className="col-span-2">
          <div className={`transition-all duration-700 ease-in-out ${
            (isItemsExpanded && !isCompliant) ? 'opacity-0 scale-95 pointer-events-none h-0 p-0 border-0 overflow-hidden' : 'opacity-100 scale-100'
          }`}>
            {isCompliant ? (
              <div className="rounded-xl border border-emerald-800 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/10 p-8">
                <div className="flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full max-w-md">
                    {/* Background circles */}
                    <circle cx="200" cy="150" r="120" fill="#10b981" opacity="0.1" />
                    <circle cx="200" cy="150" r="90" fill="#14b8a6" opacity="0.1" />
                    <circle cx="200" cy="150" r="60" fill="#059669" opacity="0.1" />
                    
                    {/* Shield with checkmark */}
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
                      d="M185 150 L195 160 L220 130"
                      stroke="#ffffff"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    
                    {/* Stars/Sparkles */}
                    <g fill="#10b981" opacity="0.8">
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
                      <rect x="80" y="130" width="30" height="40" rx="3" fill="#10b981" />
                      <line x1="85" y1="140" x2="105" y2="140" stroke="#ffffff" strokeWidth="2" />
                      <line x1="85" y1="150" x2="105" y2="150" stroke="#ffffff" strokeWidth="2" />
                      <line x1="85" y1="160" x2="100" y2="160" stroke="#ffffff" strokeWidth="2" />
                      
                      {/* Right document */}
                      <rect x="290" y="140" width="30" height="40" rx="3" fill="#14b8a6" />
                      <line x1="295" y1="150" x2="315" y2="150" stroke="#ffffff" strokeWidth="2" />
                      <line x1="295" y1="160" x2="315" y2="160" stroke="#ffffff" strokeWidth="2" />
                      <line x1="295" y1="170" x2="310" y2="170" stroke="#ffffff" strokeWidth="2" />
                    </g>
                    
                    {/* Bottom text */}
                    <text x="200" y="260" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="700">
                      100% Compliant
                    </text>
                    <text x="200" y="280" textAnchor="middle" fill="#737373" fontSize="12">
                      All compliance items completed
                    </text>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-red-800 bg-gradient-to-br from-red-500/10 via-amber-500/10 to-orange-500/10 p-8">
                <div className="flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full max-w-md">
                    {/* Background circles */}
                    <circle cx="200" cy="150" r="120" fill="#ef4444" opacity="0.1" />
                    <circle cx="200" cy="150" r="90" fill="#f59e0b" opacity="0.1" />
                    <circle cx="200" cy="150" r="60" fill="#dc2626" opacity="0.1" />
                    
                    {/* Shield with alert */}
                    <path
                      d="M200 50 L260 80 L260 140 Q260 180 200 220 Q140 180 140 140 L140 80 Z"
                      fill="#ef4444"
                      opacity="0.9"
                    />
                    <path
                      d="M200 70 L245 95 L245 140 Q245 170 200 200 Q155 170 155 140 L155 95 Z"
                      fill="#dc2626"
                      opacity="0.9"
                    />
                    
                    {/* Exclamation mark */}
                    <rect x="195" y="110" width="10" height="40" rx="2" fill="#ffffff" />
                    <circle cx="200" cy="165" r="6" fill="#ffffff" />
                    
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
                    <text x="200" y="260" textAnchor="middle" fill="#ef4444" fontSize="18" fontWeight="700">
                      Action Required
                    </text>
                    <text x="200" y="280" textAnchor="middle" fill="#737373" fontSize="12">
                      {overdueCount + pendingCount} items need attention
                    </text>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines */}
        <div>
          {/* Upcoming Deadlines */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {[
                { task: 'Q2 Earnings Report', due: 'Jun 15, 2025', priority: 'medium' },
                { task: 'NIL Contract Filing', due: 'Jul 1, 2025', priority: 'high' },
                { task: 'Brand Deal Disclosure', due: 'Aug 5, 2025', priority: 'medium' },
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

        </div>
      </div>

      {/* Recent Compliance Activity - Full Width */}
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
  );
}
