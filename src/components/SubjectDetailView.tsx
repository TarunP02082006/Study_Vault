import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  FileCode, 
  FileArchive, 
  Image as ImageIcon, 
  Plus, 
  ExternalLink, 
  Download, 
  Trash2, 
  Edit3, 
  Pin, 
  Copy, 
  Check, 
  Eye, 
  Clock, 
  Search, 
  Grid, 
  List, 
  Layers, 
  Sparkles,
  FileCheck
} from 'lucide-react';
import { Subject, StudyFile, StudyNote, FileCategory } from '../types';
import { COLOR_THEMES, formatRelativeTime, getFileTypeInfo, getSubjectIcon } from '../utils/formatters';

interface SubjectDetailViewProps {
  subject: Subject;
  files: StudyFile[];
  notes: StudyNote[];
  onBack: () => void;
  onUploadFile: (file: File, category: FileCategory) => Promise<void>;
  onDeleteFile: (file: StudyFile) => void;
  onDeleteNote: (note: StudyNote) => void;
  onEditNote: (note: StudyNote) => void;
  onOpenAddNote: (defaultCategory?: FileCategory) => void;
  onPreviewFile: (file: StudyFile) => void;
  onPreviewNote: (note: StudyNote) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  files,
  notes,
  onBack,
  onUploadFile,
  onDeleteFile,
  onDeleteNote,
  onEditNote,
  onOpenAddNote,
  onPreviewFile,
  onPreviewNote,
}) => {
  const [activeTab, setActiveTab] = useState<FileCategory>('Question Papers');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const theme = COLOR_THEMES[subject.color] || COLOR_THEMES.violet;

  // Filter files and notes for the active category
  const categoryFiles = files.filter(
    (f) => f.subject_id === subject.id && f.category === activeTab &&
    (searchQuery ? f.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  const categoryNotes = notes.filter(
    (n) => n.subject_id === subject.id && n.category === activeTab &&
    (searchQuery ? (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase())) : true)
  );

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await triggerUpload(file);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await triggerUpload(file);
    }
  };

  const triggerUpload = async (file: File) => {
    try {
      setUploadProgress(20);
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev && prev < 90 ? prev + 15 : prev));
      }, 100);

      await onUploadFile(file, activeTab);

      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 800);
    } catch (err) {
      setUploadProgress(null);
      console.error('File upload failed', err);
    }
  };

  const handleCopyNote = (note: StudyNote) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const tabs: { name: FileCategory; icon: string; count: number }[] = [
    {
      name: 'Question Papers',
      icon: '📝',
      count: files.filter((f) => f.subject_id === subject.id && f.category === 'Question Papers').length,
    },
    {
      name: 'Notes',
      icon: '📚',
      count: (files.filter((f) => f.subject_id === subject.id && f.category === 'Notes').length) +
             (notes.filter((n) => n.subject_id === subject.id && n.category === 'Notes').length),
    },
    {
      name: 'Mini Projects',
      icon: '⚡',
      count: files.filter((f) => f.subject_id === subject.id && f.category === 'Mini Projects').length,
    },
  ];

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
        <span className="text-slate-600">/</span>
        <span className="text-slate-400">Subjects</span>
        <span className="text-slate-600">/</span>
        <span className="text-violet-300 font-semibold truncate max-w-xs">{subject.name}</span>
      </div>

      {/* Subject Header Banner */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 relative overflow-hidden border border-white/10 mb-6 sm:mb-8 shadow-2xl">
        {/* Glow overlay */}
        <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br ${theme.gradient} opacity-20 blur-3xl pointer-events-none`} />
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.gradient}`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 relative z-10">
          <div className="flex items-start gap-3.5 sm:gap-5">
            {/* Subject Icon */}
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${theme.gradient} text-white shadow-xl shrink-0`}
              style={{ boxShadow: `0 8px 24px ${theme.glow}` }}
            >
              {getSubjectIcon(subject.icon, 'w-6 h-6 sm:w-8 sm:h-8')}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-medium ${theme.badgeBg} ${theme.badgeText}`}>
                  {theme.name}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
                  {formatRelativeTime(subject.updated_at)}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white font-syne truncate">
                {subject.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                {subject.description || 'No description added for this subject module.'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0 border-t border-white/5 lg:border-t-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary-gradient px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-violet-600/30 cursor-pointer min-h-[42px]"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">Upload File</span>
            </button>

            <button
              onClick={() => onOpenAddNote(activeTab)}
              className="btn-secondary-glass px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer min-h-[42px]"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" />
              <span className="truncate">New Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.zip,.ipynb,.txt"
      />

      {/* 3 Main Tabs: Question Papers | Notes | Mini Projects */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 min-h-[40px] ${
                activeTab === tab.name
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === tab.name ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search within tab & Grid/List view toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-8 pr-3 py-2 sm:py-1.5 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none w-full md:w-52"
            />
          </div>

          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 sm:p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 sm:p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Drag and Drop / Tap to Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-4 sm:p-6 text-center cursor-pointer transition-all duration-200 mb-6 sm:mb-8 ${
          isDragging
            ? 'border-pink-500 bg-pink-500/10 scale-[1.01]'
            : 'border-white/15 hover:border-violet-500/60 bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-white">
              Tap or drop {activeTab} files here, or{' '}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-pink-400 underline decoration-pink-400/50">
              browse files
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
            PDF, Images, DOCX, ZIP, Code · Stored in study-files bucket
          </p>
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress !== null && (
          <div className="absolute inset-0 bg-[#0c0924]/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 z-20">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>Uploading to {activeTab}...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="space-y-10">
        {/* Section 1: Study Files */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-syne">
              <FileCheck className="w-4 h-4 text-violet-400" />
              <span>{activeTab} Files ({categoryFiles.length})</span>
            </div>
          </div>

          {categoryFiles.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryFiles.map((file) => {
                  const typeInfo = getFileTypeInfo(file.name, file.mime_type);
                  const IconComp = typeInfo.icon;
                  const isImage = file.mime_type.startsWith('image/') || /\.(png|jpe?g|webp|svg)$/i.test(file.name);

                  return (
                    <div
                      key={file.id}
                      className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all hover:-translate-y-1 group flex flex-col justify-between"
                    >
                      {/* Image Thumbnail Preview if image */}
                      {isImage && file.file_url !== '#' && (
                        <div
                          onClick={() => onPreviewFile(file)}
                          className="relative w-full h-36 bg-black/40 overflow-hidden cursor-pointer group/img"
                        >
                          <img
                            src={file.file_url}
                            alt={file.name}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Eye className="w-5 h-5 text-white" />
                            <span className="text-xs font-semibold text-white">View Full Image</span>
                          </div>
                        </div>
                      )}

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeInfo.bgClass}`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                onClick={() => onPreviewFile(file)}
                                className="text-sm font-semibold text-white hover:text-violet-300 transition-colors cursor-pointer truncate"
                                title={file.name}
                              >
                                {file.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                                <span>{file.size_text}</span>
                                <span>·</span>
                                <span>{formatRelativeTime(file.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={() => onPreviewFile(file)}
                            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-violet-400" />
                            <span>Preview</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            {file.file_url && file.file_url !== '#' ? (
                              <a
                                href={file.file_url}
                                download={file.name}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="Download File"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <button
                                onClick={() => onPreviewFile(file)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="View Mock File"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteFile(file)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="glass-card rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/5">
                {categoryFiles.map((file) => {
                  const typeInfo = getFileTypeInfo(file.name, file.mime_type);
                  const IconComp = typeInfo.icon;

                  return (
                    <div
                      key={file.id}
                      className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.bgClass}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            onClick={() => onPreviewFile(file)}
                            className="text-xs sm:text-sm font-medium text-white hover:text-violet-300 transition-colors cursor-pointer truncate"
                          >
                            {file.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-400 font-mono flex items-center gap-2">
                            <span>{typeInfo.type}</span>
                            <span>·</span>
                            <span>{file.size_text}</span>
                            <span>·</span>
                            <span>{formatRelativeTime(file.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onPreviewFile(file)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onDeleteFile(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center border border-white/5">
              <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">No files uploaded in {activeTab}</div>
              <p className="text-xs text-slate-400 mt-1">
                Drag and drop a file above or click upload to store papers, cheat sheets, or projects.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Text Notes for This Category */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-syne">
              <FileText className="w-4 h-4 text-pink-400" />
              <span>{activeTab} Written Notes ({categoryNotes.length})</span>
            </div>

            <button
              onClick={() => onOpenAddNote(activeTab)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Note</span>
            </button>
          </div>

          {categoryNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {categoryNotes.map((note) => (
                <div
                  key={note.id}
                  className="glass-card rounded-2xl p-5 border border-white/10 hover:border-pink-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between relative group"
                >
                  {note.is_pinned && (
                    <div className="absolute top-4 right-4 text-amber-400" title="Pinned Note">
                      <Pin className="w-4 h-4 fill-amber-400" />
                    </div>
                  )}

                  <div>
                    <h4
                      onClick={() => onPreviewNote(note)}
                      className="text-base font-bold text-white font-syne hover:text-pink-300 transition-colors cursor-pointer line-clamp-1 pr-6"
                    >
                      {note.title}
                    </h4>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Markdown snippet */}
                    <div
                      onClick={() => onPreviewNote(note)}
                      className="text-xs text-slate-300 mt-3 line-clamp-3 font-normal leading-relaxed cursor-pointer opacity-90 hover:opacity-100"
                    >
                      {note.content.replace(/[#*`$]/g, '')}
                    </div>
                  </div>

                  {/* Note Footer */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatRelativeTime(note.updated_at)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Copy note content"
                      >
                        {copiedNoteId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onEditNote(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-colors"
                        title="Edit Note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteNote(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center border border-white/5">
              <p className="text-xs text-slate-400">
                No written notes saved in this tab yet. Click "Add Note" to write rich summaries and equations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
