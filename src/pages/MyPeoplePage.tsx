import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { PersonModal } from '../components/modals/PersonModal';
import { GlassmorphicCard } from '../components/cards/GlassmorphicCard';
import { BubbleCard } from '../components/cards/BubbleCard';
import { FlipCard } from '../components/cards/FlipCard';
import { ExpandableCard } from '../components/cards/ExpandableCard';
import { ProfileFirstCard } from '../components/cards/ProfileFirstCard';

interface Person {
  id: string;
  name: string;
  roles: string[];
  email: string;
  phone: string;
  accessLevel: string;
  initials: string;
  photoUrl?: string;
}

interface MyPeoplePageProps {
  people: Person[];
  onUpdatePerson: (person: Person) => void;
  onDeletePerson: (personId: string) => void;
  onAddPerson: (person: any) => void;
}

export function MyPeoplePage({ people, onUpdatePerson, onDeletePerson, onAddPerson }: MyPeoplePageProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const cardStyle = 'glassmorphic'; // Fixed to glassmorphic style

  // Calculate grid columns based on number of people
  const getGridCols = () => {
    if (people.length <= 6) return 'grid-cols-3';
    if (people.length <= 12) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Family': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      'Agent': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      'Deal Rep': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      'Coach': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      'Accountant': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      'Other': 'bg-neutral-500/10 text-neutral-300 border-neutral-500/30'
    };
    return colors[role] || 'bg-neutral-500/10 text-neutral-300 border-neutral-500/30';
  };

  const getRoleAvatarColor = (roles: string[]) => {
    // Use first role for avatar color
    const primaryRole = Array.isArray(roles) ? roles[0] : roles;
    const colors: Record<string, string> = {
      'Family': 'bg-purple-600',
      'Agent': 'bg-blue-600',
      'Deal Rep': 'bg-cyan-600',
      'Coach': 'bg-amber-600',
      'Accountant': 'bg-emerald-600',
      'Other': 'bg-neutral-600'
    };
    return colors[primaryRole] || 'bg-neutral-600';
  };

  const handlePhotoUpload = (personId: string, photoFile: File) => {
    // Convert file to data URL for display
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoUrl = reader.result as string;
      const person = people.find(p => p.id === personId);
      if (person) {
        onUpdatePerson({ ...person, photoUrl });
      }
    };
    reader.readAsDataURL(photoFile);
  };

  return (
    <div className="px-10 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold">My People</h1>
          <p className="mt-2 text-base text-neutral-400">Manage your team and their access</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-base font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Person
        </button>
      </div>


      {people.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-16 text-center">
          <div className="max-w-md mx-auto">
            <Users className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No people added yet</h2>
            <p className="text-neutral-400 mb-6">Start building your team by adding family members, agents, coaches, and more.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-base font-semibold"
            >
              Add Your First Person
            </button>
          </div>
        </div>
      ) : (
        <div className={`grid ${getGridCols()} ${cardStyle === 'flip' || cardStyle === 'expandable' ? 'gap-x-6 gap-y-12' : 'gap-6'}`}>
          {people.map((person) => {
            const commonProps = {
              key: person.id,
              person,
              onEdit: setEditingPerson,
              onDelete: setDeletingPerson,
              getRoleColor,
              getRoleAvatarColor
            };

            if (cardStyle === 'glassmorphic') {
              return <GlassmorphicCard {...commonProps} onPhotoUpload={handlePhotoUpload} />;
            }
            if (cardStyle === 'bubble') {
              return <BubbleCard {...commonProps} />;
            }
            if (cardStyle === 'flip') {
              return <FlipCard 
                {...commonProps} 
                flipped={flippedCard === person.id} 
                onFlip={() => setFlippedCard(flippedCard === person.id ? null : person.id)} 
              />;
            }
            if (cardStyle === 'expandable') {
              return <ExpandableCard 
                {...commonProps} 
                expanded={expandedCard === person.id} 
                onToggle={() => setExpandedCard(expandedCard === person.id ? null : person.id)} 
              />;
            }
            if (cardStyle === 'profile') {
              return <ProfileFirstCard {...commonProps} />;
            }
            
            return null;
          })}
        </div>
      )}

      {showModal && <PersonModal onClose={() => setShowModal(false)} onSave={onAddPerson} />}
      {editingPerson && <PersonModal person={editingPerson} onClose={() => setEditingPerson(null)} onSave={onUpdatePerson} />}
      
      {/* Delete Confirmation */}
      {deletingPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Remove {deletingPerson.name}?</h3>
            <p className="text-neutral-400 mb-6">
              This person will be removed from your team. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingPerson(null)}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePerson(deletingPerson.id);
                  setDeletingPerson(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
