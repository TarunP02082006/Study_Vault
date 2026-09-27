import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  FileText, 
  Folder, 
  FileCode, 
  ArrowRight, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { Subject, StudyFile, StudyNote } from '../types';
import { searchAll } from '../services/supabaseService';
import { formatRelativeTime, getFileTypeInfo } from '../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (subject: Subject) => void;
  onSelectFile: (file: StudyFile) => void;
  onSelectNote: (note: StudyNote) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSubject,
  onSelectFile,
  onSelectNote,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'subjects' | 'files' | 'notes'>('all');
  const [results, setResults] = useState<{
    subjects: Subject[];
    files: (StudyFile & { subjectName?: string })[];
    notes: (StudyNote & { subjectName?: string })[];
  }>({ subjects: [], files: [], notes: [] });
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ subjects: [], files: [], notes: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ subjects: [], files: [], notes: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchAll(query);
        setResults(res);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Global CMD+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalResultsCount =
    results.subjects.length + results.files.length + results.notes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-24 px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="glass-dropdown w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-5 border-b border-white/10 flex items-center gap-2.5 sm:gap-3">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all subjects, papers, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="sm:hidden p-1 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <kbd className="hidden sm:inline px-2 py-1 rounded bg-white/10 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Filter Segment Tabs */}
        {query && (
          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border-b border-white/5 bg-white/[0.02] text-xs overflow-x-auto no-scrollbar touch-pan-x">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({totalResultsCount})
            </button>
            <button
              onClick={() => setCategoryFilter('subjects')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                categoryFilter === 'subjects'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Subjects ({results.subjects.length})
            </button>
            <button
              onClick={() => setCategoryFilter('files')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                categoryFilter === 'files'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Files ({results.files.length})
            </button>
            <button
              onClick={() => setCategoryFilter('notes')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                categoryFilter === 'notes'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Notes ({results.notes.length})
            </button>
          </div>
        )}

        {/* Results Container */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-4 flex-1 divide-y divide-white/5">
          {!query ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Type a keyword to instantly query your personal study vault.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-white/5">Consensus</span>
                <span className="px-2 py-0.5 rounded bg-white/5">Transformer</span>
                <span className="px-2 py-0.5 rounded bg-white/5">Exam Papers</span>
                <span className="px-2 py-0.5 rounded bg-white/5">Red-Black Tree</span>
              </div>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-violet-400/50 mx-auto mb-2" />
              <p className="text-xs">No matching study materials found for "{query}".</p>
            </div>
          ) : (
            <>
              {/* Subjects Group */}
              {(categoryFilter === 'all' || categoryFilter === 'subjects') &&
                results.subjects.length > 0 && (
                  <div className="pt-2 first:pt-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-400 px-3 mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Subjects ({results.subjects.length})</span>
                    </div>
                    <div className="space-y-1">
                      {results.subjects.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => {
                            onSelectSubject(sub);
                            onClose();
                          }}
                          className="p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between gap-3 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-violet-600/30 flex items-center justify-center text-violet-300">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-violet-300 truncate">
                                {sub.name}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {sub.description}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Files Group */}
              {(categoryFilter === 'all' || categoryFilter === 'files') &&
                results.files.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-pink-400 px-3 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Study Files & Question Papers ({results.files.length})</span>
                    </div>
                    <div className="space-y-1">
                      {results.files.map((file) => {
                        const typeInfo = getFileTypeInfo(file.name, file.mime_type);
                        const IconComp = typeInfo.icon;

                        return (
                          <div
                            key={file.id}
                            onClick={() => {
                              onSelectFile(file);
                              onClose();
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between gap-3 cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.bgClass}`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-pink-300 truncate">
                                  {file.name}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                                  <span className="text-violet-300 font-sans">
                                    {file.subjectName}
                                  </span>
                                  <span>·</span>
                                  <span>{file.category}</span>
                                  <span>·</span>
                                  <span>{file.size_text}</span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Notes Group */}
              {(categoryFilter === 'all' || categoryFilter === 'notes') &&
                results.notes.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 px-3 mb-2 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Written Notes & Summaries ({results.notes.length})</span>
                    </div>
                    <div className="space-y-1">
                      {results.notes.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => {
                            onSelectNote(note);
                            onClose();
                          }}
                          className="p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between gap-3 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-300 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 truncate">
                                {note.title}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                <span className="text-violet-300 mr-2">{note.subjectName}</span>
                                {note.content.replace(/[#*`$]/g, '')}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
