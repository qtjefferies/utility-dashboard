import React from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface ExpandableCardProps {
  person: {
    id: string;
    name: string;
    roles: string[];
    email: string;
    phone: string;
    accessLevel: string;
    initials: string;
  };
  onEdit: (person: any) => void;
  onDelete: (person: any) => void;
  getRoleColor: (role: string) => string;
  getRoleAvatarColor: (roles: string[]) => string;
  expanded: boolean;
  onToggle: () => void;
}

export function ExpandableCard({ person, onEdit, onDelete, getRoleColor, getRoleAvatarColor, expanded, onToggle }: ExpandableCardProps) {
  return (
    <div className={`rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden ${expanded ? 'row-span-2' : ''}`}>
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className={`${getRoleAvatarColor(person.roles)} ${expanded ? 'h-16 w-16' : 'h-12 w-12'} rounded-full flex items-center justify-center transition-all`}>
            <span className={`font-bold ${expanded ? 'text-xl' : 'text-base'} text-white transition-all`}>{person.initials}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-neutral-100">{person.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {(Array.isArray(person.roles) ? person.roles : [person.roles]).slice(0, expanded ? 10 : 2).map((role, idx) => (
                <span key={idx} className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${getRoleColor(role)}`}>
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="text-neutral-500">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 space-y-4 animate-fadeIn">
          <div className="space-y-3 text-sm text-neutral-300">
            <div className="flex items-center gap-2 bg-neutral-800/50 rounded-lg px-3 py-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate text-xs">{person.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-800/50 rounded-lg px-3 py-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs">{person.phone}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-800">
            <button onClick={(e) => { e.stopPropagation(); onEdit(person); }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
              Edit
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(person); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
