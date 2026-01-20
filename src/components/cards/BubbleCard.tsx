import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface BubbleCardProps {
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
}

const getRoleGradient = (roles: string[] | string) => {
  const primaryRole = Array.isArray(roles) ? roles[0] : roles;
  const gradients: Record<string, string> = {
    'Family': 'from-purple-600 to-pink-600',
    'Agent': 'from-blue-600 to-cyan-600',
    'Deal Rep': 'from-cyan-600 to-teal-600',
    'Coach': 'from-amber-600 to-orange-600',
    'Accountant': 'from-emerald-600 to-green-600',
    'Other': 'from-neutral-600 to-neutral-500'
  };
  return gradients[primaryRole] || 'from-neutral-600 to-neutral-500';
};

export function BubbleCard({ person, onEdit, onDelete, getRoleColor, getRoleAvatarColor }: BubbleCardProps) {
  return (
    <div
      className="rounded-[2rem] border-2 border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 hover:scale-105 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300 group flex flex-col relative overflow-hidden cursor-pointer"
      onClick={() => {}}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRoleGradient(person.roles)} opacity-10 group-hover:opacity-20 transition-opacity`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className={`bg-gradient-to-br ${getRoleGradient(person.roles)} h-16 w-16 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow`}>
              <span className="font-bold text-xl text-white drop-shadow-lg">{person.initials}</span>
            </div>
            <div className={`absolute -bottom-0 -right-0 h-6 w-6 bg-gradient-to-br ${getRoleGradient(person.roles)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
              ✓
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(person); }} className="p-2 bg-neutral-800 hover:bg-emerald-600 rounded-2xl text-neutral-400 hover:text-white transition-all hover:scale-110">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(person); }} className="p-2 bg-neutral-800 hover:bg-red-600 rounded-2xl text-neutral-400 hover:text-white transition-all hover:scale-110">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mb-3">
          <h3 className="font-bold text-xl text-neutral-100 mb-2">{person.name}</h3>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(person.roles) ? person.roles : [person.roles]).map((role, idx) => (
              <span key={idx} className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${getRoleGradient([role])} text-white shadow-md`}>
                {role}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-sm text-neutral-400">
          <div className="flex items-center gap-2 bg-neutral-800/50 rounded-2xl px-3 py-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate text-xs">{person.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
