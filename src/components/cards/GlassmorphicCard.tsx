import React, { useRef } from 'react';
import { Edit2, Trash2, Camera } from 'lucide-react';

interface GlassmorphicCardProps {
  person: {
    id: string;
    name: string;
    roles: string[];
    email: string;
    phone: string;
    accessLevel: string;
    initials: string;
    photoUrl?: string;
  };
  onEdit: (person: any) => void;
  onDelete: (person: any) => void;
  onPhotoUpload: (personId: string, photoFile: File) => void;
  getRoleColor: (role: string) => string;
  getRoleAvatarColor: (roles: string[]) => string;
}

export function GlassmorphicCard({ person, onEdit, onDelete, onPhotoUpload, getRoleColor, getRoleAvatarColor }: GlassmorphicCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      onPhotoUpload(person.id, file);
    }
  };

  const getAccessLevelBadge = () => {
    if (person.accessLevel === 'admin') {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Admin</span>;
    }
    if (person.accessLevel === 'read-only') {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">Read-Only</span>;
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-neutral-700/50 bg-gradient-to-br from-neutral-900/60 to-neutral-800/40 backdrop-blur-xl p-6 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <button
              onClick={handlePhotoClick}
              className={`${getRoleAvatarColor(person.roles)} h-16 w-16 rounded-full flex items-center justify-center ring-4 ring-neutral-800/50 group-hover:ring-emerald-500/30 transition-all overflow-hidden cursor-pointer relative group/photo`}
            >
              {person.photoUrl ? (
                <>
                  <img 
                    src={person.photoUrl} 
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <span className="font-bold text-xl text-white">{person.initials}</span>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-neutral-900 shadow-lg" />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(person)} className="p-2 bg-neutral-800/80 hover:bg-emerald-600 backdrop-blur rounded-lg text-neutral-400 hover:text-white transition-colors">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(person)} className="p-2 bg-neutral-800/80 hover:bg-red-600 backdrop-blur rounded-lg text-neutral-400 hover:text-white transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-bold text-xl text-neutral-100 mb-2">{person.name}</h3>
          <div className="flex flex-wrap gap-2 items-center">
            {(Array.isArray(person.roles) ? person.roles : [person.roles]).map((role, idx) => (
              <span key={idx} className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur ${getRoleColor(role)}`}>
                {role}
              </span>
            ))}
            {getAccessLevelBadge()}
          </div>
        </div>
        <div className="space-y-2 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{person.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{person.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
