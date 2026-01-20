import React from 'react';
import { Edit2, Trash2, Sparkles } from 'lucide-react';

interface ProfileFirstCardProps {
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
    'Family': 'from-purple-500 via-pink-500 to-rose-500',
    'Agent': 'from-blue-500 via-cyan-500 to-teal-500',
    'Deal Rep': 'from-cyan-500 via-teal-500 to-emerald-500',
    'Coach': 'from-amber-500 via-orange-500 to-red-500',
    'Accountant': 'from-emerald-500 via-green-500 to-lime-500',
    'Other': 'from-neutral-500 via-neutral-400 to-neutral-500'
  };
  return gradients[primaryRole] || 'from-neutral-500 to-neutral-400';
};

export function ProfileFirstCard({ person, onEdit, onDelete, getRoleColor, getRoleAvatarColor }: ProfileFirstCardProps) {
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col overflow-hidden">
      {/* Header gradient */}
      <div className={`h-20 bg-gradient-to-r ${getRoleGradient(person.roles)} opacity-20 group-hover:opacity-30 transition-opacity`} />

      <div className="px-6 pb-6 -mt-12 relative z-10">
        <div className="flex items-end justify-between mb-4">
          <div className="relative">
            <div className={`bg-gradient-to-br ${getRoleGradient(person.roles)} h-24 w-24 rounded-full flex items-center justify-center ring-4 ring-neutral-900 shadow-xl`}>
              <span className="font-bold text-3xl text-white drop-shadow-lg">{person.initials}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-emerald-500 rounded-full border-4 border-neutral-900 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="flex gap-2 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button onClick={() => onEdit(person)} className="p-2.5 bg-neutral-800 hover:bg-emerald-600 rounded-xl text-neutral-400 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/50">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(person)} className="p-2.5 bg-neutral-800 hover:bg-red-600 rounded-xl text-neutral-400 hover:text-white transition-all shadow-lg hover:shadow-red-500/50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-2xl text-neutral-100 mb-2">{person.name}</h3>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(person.roles) ? person.roles : [person.roles]).map((role, idx) => (
              <span key={idx} className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${getRoleGradient([role])} text-white shadow-md`}>
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm text-neutral-400">
          <div className="flex items-center gap-3 bg-neutral-800/30 rounded-xl px-4 py-3">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate text-xs text-neutral-300">{person.email}</span>
          </div>
          <div className="flex items-center gap-3 bg-neutral-800/30 rounded-xl px-4 py-3">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-xs text-neutral-300">{person.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
