import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Subject, SubjectColor } from '../types';
import { COLOR_THEMES, AVAILABLE_ICONS } from '../utils/formatters';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSubject: (subjectData: {
    name: string;
    description: string;
    color: SubjectColor;
    icon: string;
  }) => Promise<void>;
  editSubject?: Subject | null;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  onSaveSubject,
  editSubject,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<SubjectColor>('violet');
  const [icon, setIcon] = useState('Book');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editSubject) {
      setName(editSubject.name);
      setDescription(editSubject.description || '');
      setColor(editSubject.color);
      setIcon(editSubject.icon || 'Book');
    } else {
      setName('');
      setDescription('');
      setColor('violet');
      setIcon('Book');
    }
    setError('');
  }, [editSubject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a subject name.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSaveSubject({
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
      });

      // Fire confetti celebration if creating new subject
      if (!editSubject) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7c3aed', '#ec4899', '#06b6d4', '#10b981'],
        });
      }

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save subject.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-dropdown w-full max-w-[440px] rounded-2xl border border-white/15 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-white font-syne">
              {editSubject ? 'Edit Subject' : 'New Subject'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Subject Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Systems & Cloud"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description / Topics
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Raft consensus, CAP theorem, Paxos, fault tolerance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input px-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Color Palette Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Theme Color
            </label>
            <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-xl bg-white/[0.02] border border-white/10">
              {(Object.keys(COLOR_THEMES) as SubjectColor[]).map((cKey) => {
                const cTheme = COLOR_THEMES[cKey];
                const isSelected = color === cKey;

                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border relative cursor-pointer ${
                      isSelected
                        ? 'border-white ring-2 ring-violet-500 scale-110 shadow-lg'
                        : 'border-white/10 hover:border-white/40 hover:scale-105'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${cTheme.accentHex}, ${cTheme.accentHex}bb)`,
                    }}
                    title={cTheme.name}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-1.5 max-h-24 overflow-y-auto p-1 rounded-xl bg-white/[0.02] border border-white/10">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.component;
                const isSelected = icon.toLowerCase() === item.name.toLowerCase();

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    className={`p-1.5 rounded-lg flex items-center justify-center transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/40 border-violet-400 text-white ring-1 ring-violet-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={item.label}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-gradient px-4 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-violet-600/30 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : editSubject ? 'Save' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
