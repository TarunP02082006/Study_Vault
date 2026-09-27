import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Bold, 
  Italic, 
  Heading, 
  Code, 
  List, 
  Quote, 
  Sigma, 
  Eye, 
  Edit3, 
  Pin, 
  Tag, 
  Sparkles 
} from 'lucide-react';
import { Subject, StudyNote, FileCategory } from '../types';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  defaultSubjectId?: string;
  defaultCategory?: FileCategory;
  editNote?: StudyNote | null;
  onSaveNote: (noteData: {
    subject_id: string;
    title: string;
    content: string;
    category: FileCategory;
    tags: string[];
    is_pinned: boolean;
  }) => Promise<void>;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  subjects,
  defaultSubjectId,
  defaultCategory,
  editNote,
  onSaveNote,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [category, setCategory] = useState<FileCategory>('Notes');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setSubjectId(editNote.subject_id);
      setCategory(editNote.category);
      setTagsInput(editNote.tags ? editNote.tags.join(', ') : '');
      setIsPinned(Boolean(editNote.is_pinned));
    } else {
      setTitle('');
      setContent('');
      setSubjectId(defaultSubjectId || (subjects[0]?.id || ''));
      setCategory(defaultCategory || 'Notes');
      setTagsInput('');
      setIsPinned(false);
    }
    setIsPreview(false);
    setError('');
  }, [editNote, defaultSubjectId, defaultCategory, subjects, isOpen]);

  if (!isOpen) return null;

  const handleFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('note-content-area') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + (selectedText || 'text') + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a note title.');
      return;
    }
    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    try {
      await onSaveNote({
        subject_id: subjectId,
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        is_pinned: isPinned,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-dropdown w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3.5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white font-syne truncate">
                {editNote ? 'Edit Study Note' : 'New Study Note'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`px-2.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[34px] ${
                isPreview
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreview ? 'Editor' : 'Preview'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Row 1: Title */}
          <div>
            <input
              type="text"
              required
              placeholder="Note Title (e.g. Raft Consensus Theorems)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base font-bold text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Row 2: Subject & Category Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs text-slate-200 bg-[#16123a] focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#16123a] text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FileCategory)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs text-slate-200 bg-[#16123a] focus:outline-none"
              >
                <option value="Question Papers" className="bg-[#16123a] text-white">
                  Question Papers
                </option>
                <option value="Notes" className="bg-[#16123a] text-white">
                  Notes
                </option>
                <option value="Mini Projects" className="bg-[#16123a] text-white">
                  Mini Projects
                </option>
              </select>
            </div>
          </div>

          {/* Markdown Formatting Toolbar with horizontal swipe */}
          {!isPreview && (
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl text-slate-300 overflow-x-auto no-scrollbar touch-pan-x">
              <button
                type="button"
                onClick={() => handleFormat('### ')}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white shrink-0 min-w-[32px] flex items-center justify-center"
                title="Heading 3"
              >
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('**', '**')}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white shrink-0 min-w-[32px] flex items-center justify-center"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('*', '*')}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white shrink-0 min-w-[32px] flex items-center justify-center"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('`', '`')}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white shrink-0 min-w-[32px] flex items-center justify-center"
                title="Inline Code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('- ')}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white shrink-0 min-w-[32px] flex items-center justify-center"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('> ')}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white shrink-0 min-w-[32px] flex items-center justify-center"
                title="Quote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('$$\n', '\n$$')}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white shrink-0 min-w-[32px] flex items-center justify-center text-pink-400"
                title="Math Formula Block"
              >
                <Sigma className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Editor Textarea or Live Preview */}
          {isPreview ? (
            <div className="w-full min-h-[180px] sm:min-h-[220px] max-h-[300px] overflow-y-auto glass-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-syne">{title || 'Untitled Note'}</h2>
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-300">
                {content || '*No content written yet.*'}
              </div>
            </div>
          ) : (
            <div>
              <textarea
                id="note-content-area"
                rows={7}
                placeholder="Write your study notes using markdown... supports headings, bullet points, code snippets, and mathematical definitions."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Row 4: Tags and Pin Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-400 mb-1">
                <Tag className="w-3 h-3 text-violet-400" />
                <span>Tags (comma-separated)</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Consensus, Raft, Exam-Prep"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none sm:pt-4">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded bg-white/10 border-white/20 text-violet-600 focus:ring-violet-500"
              />
              <Pin className="w-3.5 h-3.5 text-amber-400" />
              <span>Pin to top</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-gradient px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50 min-h-[38px]"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{isSubmitting ? 'Saving...' : editNote ? 'Update' : 'Save Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
