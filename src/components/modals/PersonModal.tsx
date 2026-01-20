import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PersonModalProps {
  person?: {
    id: string;
    name: string;
    roles: string[];
    email: string;
    phone: string;
    accessLevel: string;
    initials: string;
    photoUrl?: string;
  };
  onClose: () => void;
  onSave: (person: any) => void;
}

export function PersonModal({ person, onClose, onSave }: PersonModalProps) {
  const isEditing = !!person;
  const [formData, setFormData] = useState({
    name: person?.name || '',
    roles: person?.roles || [],
    email: person?.email || '',
    phone: person?.phone || '',
    accessLevel: person?.accessLevel || 'read-only',
    initials: person?.initials || '',
    photoUrl: person?.photoUrl || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = ['Family', 'Agent', 'Deal Rep', 'Coach', 'Accountant', 'Other'];

  const handleSubmit = () => {
    console.log('🚀 FORM SUBMIT TRIGGERED');
    console.log('📝 Form data:', formData);

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.roles.length === 0) newErrors.roles = 'At least one role is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ VALIDATION FAILED:', newErrors);
      setErrors(newErrors);
      return;
    }

    console.log('✅ VALIDATION PASSED');

    // Auto-generate initials if not provided
    let initials = formData.initials;
    if (!initials && formData.name) {
      const nameParts = formData.name.trim().split(' ');
      if (nameParts.length >= 2) {
        initials = nameParts[0][0] + nameParts[nameParts.length - 1][0];
      } else {
        initials = nameParts[0].substring(0, 2);
      }
      initials = initials.toUpperCase();
    }

    const personData = { ...formData, initials };

    console.log('💾 Calling onSave with:', personData);

    if (isEditing) {
      onSave({ ...person, ...personData });
    } else {
      onSave(personData);
    }

    console.log('🎉 Person saved successfully!');
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleRole = (role: string) => {
    setFormData(prev => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles: newRoles };
    });
    // Clear error when user selects a role
    if (errors.roles) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.roles;
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 flex-shrink-0">
          <h2 className="text-xl font-semibold">{isEditing ? 'Edit Person' : 'Add Person'}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Name & Role Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="person-name" className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="person-name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Smith"
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-800 focus:border-emerald-600 focus:ring-emerald-600'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Roles - Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Roles * <span className="text-xs text-neutral-500">(Select all that apply)</span>
                </label>
                <div className={`grid grid-cols-2 gap-2 p-2 bg-neutral-950 border rounded-lg ${
                  errors.roles
                    ? 'border-red-500'
                    : 'border-neutral-800'
                }`}>
                  {roles.map(role => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-900 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-950 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0"
                      />
                      <span className="text-xs text-neutral-300">{role}</span>
                    </label>
                  ))}
                </div>
                {errors.roles && <p className="text-xs text-red-400 mt-1">{errors.roles}</p>}
              </div>
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="person-email" className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="person-email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-800 focus:border-emerald-600 focus:ring-emerald-600'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="person-phone" className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="person-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-800 focus:border-emerald-600 focus:ring-emerald-600'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Initials */}
            <div>
              <label htmlFor="person-initials" className="block text-sm font-medium text-neutral-300 mb-1.5">
                Initials (optional)
              </label>
              <input
                type="text"
                id="person-initials"
                name="initials"
                value={formData.initials}
                onChange={(e) => handleChange('initials', e.target.value.toUpperCase())}
                placeholder="Auto-generated"
                maxLength={2}
                className="w-24 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <p className="text-xs text-neutral-500 mt-1">Click the avatar on the card to upload a photo</p>
            </div>

            {/* Access Level */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-3">
              <div className="text-sm font-medium text-neutral-100 mb-2">Access Level</div>
              <div className="space-y-1.5">
                <label htmlFor="access-read" className="flex items-start gap-2 p-2 rounded-lg cursor-pointer hover:bg-neutral-900 transition-colors">
                  <input
                    type="radio"
                    id="access-read"
                    name="accessLevel"
                    value="read-only"
                    checked={formData.accessLevel === 'read-only'}
                    onChange={(e) => handleChange('accessLevel', e.target.value)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-100">Read Only</div>
                    <div className="text-xs text-neutral-500">View only</div>
                  </div>
                </label>
                <label htmlFor="access-admin" className="flex items-start gap-2 p-2 rounded-lg cursor-pointer hover:bg-neutral-900 transition-colors">
                  <input
                    type="radio"
                    id="access-admin"
                    name="accessLevel"
                    value="admin"
                    checked={formData.accessLevel === 'admin'}
                    onChange={(e) => handleChange('accessLevel', e.target.value)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-100">Admin Access</div>
                    <div className="text-xs text-neutral-500">Full access</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                {isEditing ? 'Save' : 'Add Person'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
