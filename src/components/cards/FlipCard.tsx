import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface FlipCardProps {
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
  flipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ person, onEdit, onDelete, getRoleColor, getRoleAvatarColor, flipped, onFlip }: FlipCardProps) {
  return (
    <div className="h-full min-h-[280px] perspective-1000" onClick={onFlip}>
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 hover:border-emerald-500/50 transition-all">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center mb-4">
              <div className={`${getRoleAvatarColor(person.roles)} h-20 w-20 rounded-full flex items-center justify-center ring-4 ring-emerald-500/20`}>
                <span className="font-bold text-2xl text-white">{person.initials}</span>
              </div>
            </div>
            <h3 className="font-bold text-xl text-center text-neutral-100 mb-2">{person.name}</h3>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {(Array.isArray(person.roles) ? person.roles : [person.roles]).map((role, idx) => (
                <span key={idx} className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(role)}`}>
                  {role}
                </span>
              ))}
            </div>
            <div className="mt-auto text-center text-sm text-neutral-500">
              Click to flip →
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-neutral-900 to-neutral-800 p-6">
          <div className="flex flex-col h-full">
            <h3 className="font-bold text-lg text-neutral-100 mb-4 text-center">Contact Info</h3>
            <div className="space-y-3 text-sm text-neutral-300 mb-4">
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
            <div className="mt-auto flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); onEdit(person); }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
                Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(person); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
                Delete
              </button>
            </div>
            <div className="mt-3 text-center text-sm text-neutral-500">
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
