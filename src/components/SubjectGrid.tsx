import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Folder, 
  FileText, 
  Clock, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Upload,
  Layers,
  Sparkles
} from 'lucide-react';
import { Subject } from '../types';
import { COLOR_THEMES, formatRelativeTime, getSubjectIcon } from '../utils/formatters';

interface SubjectGridProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onOpenAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
  onQuickUpload: (subject: Subject) => void;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({
  subjects,
  onSelectSubject,
  onOpenAddSubject,
  onEditSubject,
  onDeleteSubject,
  onQuickUpload,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');

  const filteredSubjects = subjects.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesColor = selectedColor === 'all' || s.color === selectedColor;
    return matchesQuery && matchesColor;
  });

  return (
    <section id="subjects-section" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Organized Knowledge Modules</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-syne">
              My Subjects & Courses
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select a subject to access question papers, high-yield notes, and mini projects.
            </p>
          </div>

          {/* Controls: Search & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Filter subjects..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="glass-input px-3.5 py-2.5 sm:py-2 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none w-full sm:w-56"
            />

            <button
              onClick={onOpenAddSubject}
              className="btn-primary-gradient px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/30 cursor-pointer w-full sm:w-auto min-h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>New Subject</span>
            </button>
          </div>
        </div>

        {/* Color Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 pb-3 overflow-x-auto text-xs mb-4 no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedColor('all')}
            className={`px-3 py-1.5 sm:py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              selectedColor === 'all'
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            All Themes ({subjects.length})
          </button>
          {Object.entries(COLOR_THEMES).map(([key, theme]) => {
            const count = subjects.filter((s) => s.color === key).length;
            if (count === 0 && selectedColor !== key) return null;
            return (
              <button
                key={key}
                onClick={() => setSelectedColor(key)}
                className={`px-2.5 py-1.5 sm:py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  selectedColor === key
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.accentHex }}
                />
                <span className="capitalize">{key}</span>
                <span className="text-[10px] text-slate-500">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Render Subject Cards */}
          {filteredSubjects.map((subject) => {
            const theme = COLOR_THEMES[subject.color] || COLOR_THEMES.violet;
            const isMenuOpen = activeMenuId === subject.id;

            return (
              <div
                key={subject.id}
                className="glass-card rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group flex flex-col justify-between"
                style={{
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)`,
                }}
              >
                {/* Top Theme Accent Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`} />

                {/* Card Interior */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  {/* Header Row: Icon + Title + 3-Dot Menu */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      {/* Icon */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${theme.gradient} text-white shadow-md`}
                        style={{ boxShadow: `0 4px 14px ${theme.glow}` }}
                      >
                        {getSubjectIcon(subject.icon, 'w-5 h-5')}
                      </div>

                      {/* 3-Dot Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : subject.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Subject Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            className="absolute right-0 top-8 z-30 w-44 rounded-xl glass-dropdown p-1.5 text-xs text-slate-200 border border-white/15 shadow-2xl animate-in fade-in zoom-in-95"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                onSelectSubject(subject);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-white"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
                              <span>Open Vault</span>
                            </button>

                            <button
                              onClick={() => {
                                onQuickUpload(subject);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-slate-200"
                            >
                              <Upload className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Quick Upload</span>
                            </button>

                            <button
                              onClick={() => {
                                onEditSubject(subject);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-slate-200"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Edit Subject</span>
                            </button>

                            <div className="h-px bg-white/10 my-1" />

                            <button
                              onClick={() => {
                                onDeleteSubject(subject);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Subject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subject Title */}
                    <h3
                      onClick={() => onSelectSubject(subject)}
                      className="text-lg font-bold text-white font-syne hover:text-violet-300 transition-colors cursor-pointer line-clamp-1"
                      title={subject.name}
                    >
                      {subject.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal min-h-[32px]">
                      {subject.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Footer Meta & Open Button */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    {/* File & Note Count Unboxed Metadata */}
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Folder className="w-3 h-3 text-violet-400" />
                        <span>{subject.file_count ?? 0} files</span>
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <FileText className="w-3 h-3 text-pink-400" />
                        <span>{subject.note_count ?? 0} notes</span>
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500" title={new Date(subject.updated_at).toLocaleString()}>
                        {formatRelativeTime(subject.updated_at)}
                      </span>
                    </div>

                    {/* Enter Action */}
                    <button
                      onClick={() => onSelectSubject(subject)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-violet-500/40 transition-all flex items-center gap-1 cursor-pointer group-hover:text-white"
                    >
                      <span>Open</span>
                      <span className="text-violet-400">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Subject Card Slot */}
          <div
            onClick={onOpenAddSubject}
            className="rounded-2xl border-2 border-dashed border-white/15 hover:border-violet-500/60 bg-white/[0.02] hover:bg-white/[0.04] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 group-hover:bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:text-pink-300 transition-all mb-3 shadow-lg">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-syne group-hover:text-violet-300 transition-colors">
              Add New Subject
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Create a dedicated vault for question papers, notes & projects.
            </p>
          </div>
        </div>

        {/* Empty Search Result */}
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl p-8 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No matching subjects</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or color filter, or create a new subject.
            </p>
            <button
              onClick={() => {
                setFilterQuery('');
                setSelectedColor('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
