import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, FileText, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface Obligation {
  id: string;
  title: string;
  date: string;
  type: 'deal' | 'tax' | 'compliance' | 'payment' | 'deliverable';
  priority?: 'high' | 'medium' | 'low';
  description?: string;
}

interface ObligationsCalendarModalProps {
  onClose: () => void;
  obligations: Obligation[];
}

export function ObligationsCalendarModal({ onClose, obligations }: ObligationsCalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deal': return <FileText className="h-4 w-4" />;
      case 'tax': return <DollarSign className="h-4 w-4" />;
      case 'compliance': return <TrendingUp className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'deliverable': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deal': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'tax': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'compliance': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'payment': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'deliverable': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getObligationsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return obligations.filter(obl => obl.date.startsWith(dateStr));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  // Sort obligations by date
  const sortedObligations = [...obligations].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl font-semibold">Upcoming & Obligations</h2>
            <p className="text-sm text-neutral-400 mt-1">Track your deadlines and commitments</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              List View
            </button>
          </div>

          {viewMode === 'calendar' && (
            <div className="flex items-center gap-4">
              <button onClick={previousMonth} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-semibold min-w-[180px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'calendar' ? (
            <div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-neutral-400 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for alignment */}
                {blanks.map(blank => (
                  <div key={`blank-${blank}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {days.map(day => {
                  const dayObligations = getObligationsForDate(day);
                  const hasObligations = dayObligations.length > 0;
                  const isToday = new Date().getDate() === day && 
                                  new Date().getMonth() === currentDate.getMonth() &&
                                  new Date().getFullYear() === currentDate.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-2 ${
                        isToday
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-neutral-800 bg-neutral-900/40'
                      } ${hasObligations ? 'hover:bg-neutral-800 cursor-pointer' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-emerald-400' : 'text-neutral-300'}`}>
                        {day}
                      </div>
                      {dayObligations.length > 0 && (
                        <div className="space-y-1">
                          {dayObligations.slice(0, 2).map(obl => (
                            <div
                              key={obl.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedObligation(obl);
                              }}
                              className={`text-xs px-1.5 py-0.5 rounded border ${getTypeColor(obl.type)} truncate cursor-pointer hover:opacity-80 transition-opacity`}
                            >
                              {obl.title}
                            </div>
                          ))}
                          {dayObligations.length > 2 && (
                            <div 
                              className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedObligation(dayObligations[2]);
                              }}
                            >
                              +{dayObligations.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {sortedObligations.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming obligations</p>
                </div>
              ) : (
                sortedObligations.map(obl => (
                  <div
                    key={obl.id}
                    onClick={() => setSelectedObligation(obl)}
                    className={`rounded-lg border p-4 ${getTypeColor(obl.type)} cursor-pointer hover:opacity-80 transition-opacity`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">{getTypeIcon(obl.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{obl.title}</h3>
                            {obl.priority && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                obl.priority === 'high'
                                  ? 'bg-red-500/20 text-red-400'
                                  : obl.priority === 'medium'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-neutral-500/20 text-neutral-400'
                              }`}>
                                {obl.priority}
                              </span>
                            )}
                          </div>
                          {obl.description && (
                            <p className="text-sm opacity-80 mb-2">{obl.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs opacity-60">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(obl.date + 'T00:00:00').toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedObligation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedObligation(null)}>
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 w-full max-w-md shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold">Event Details</h3>
              <button
                onClick={() => setSelectedObligation(null)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <h4 className="text-xl font-bold mb-2">{selectedObligation.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(selectedObligation.type)}`}>
                    {getTypeIcon(selectedObligation.type)}
                    {selectedObligation.type.charAt(0).toUpperCase() + selectedObligation.type.slice(1)}
                  </span>
                  {selectedObligation.priority && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedObligation.priority === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : selectedObligation.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-neutral-500/20 text-neutral-400'
                    }`}>
                      {selectedObligation.priority.toUpperCase()} PRIORITY
                    </span>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="h-4 w-4" />
                <span>{new Date(selectedObligation.date + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>

              {/* Description */}
              {selectedObligation.description && (
                <div>
                  <h5 className="text-sm font-semibold text-neutral-400 mb-1">Details</h5>
                  <p className="text-neutral-300">{selectedObligation.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => setSelectedObligation(null)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Close
                </button>
                <button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
