import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  Pin, 
  Tag, 
  Sparkles,
  Printer
} from 'lucide-react';
import { StudyFile, StudyNote } from '../types';
import { formatRelativeTime, getFileTypeInfo } from '../utils/formatters';

interface FilePreviewModalProps {
  file?: StudyFile | null;
  note?: StudyNote | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  note,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!file && !note) return null;

  const handleCopyNote = () => {
    if (!note) return;
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-dropdown w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {file ? (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-violet-600/30 flex items-center justify-center text-violet-300 shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-pink-600/30 flex items-center justify-center text-pink-300 shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-xs sm:text-base font-bold text-white font-syne truncate">
                {file ? file.name : note?.title}
              </h3>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center gap-1.5 sm:gap-2">
                <span>{file ? file.category : note?.category}</span>
                <span>·</span>
                <span>
                  {formatRelativeTime(file ? file.created_at : (note?.created_at || ''))}
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {note && (
              <>
                <button
                  onClick={handleCopyNote}
                  className="px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/15 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[34px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center"
                  title="Print Note"
                >
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </>
            )}

            {file && file.file_url && file.file_url !== '#' && (
              <a
                href={file.file_url}
                download={file.name}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg sm:rounded-xl btn-primary-gradient text-xs font-semibold text-white flex items-center gap-1.5 shadow-md cursor-pointer min-h-[34px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 bg-[#09071c]">
          {/* File Preview */}
          {file && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              {file.mime_type.startsWith('image/') || /\.(png|jpe?g|webp|svg)$/i.test(file.name) ? (
                <div className="rounded-2xl overflow-hidden max-h-[65vh] border border-white/10 shadow-2xl">
                  <img
                    src={file.file_url}
                    alt={file.name}
                    className="max-h-[65vh] w-auto object-contain mx-auto"
                  />
                </div>
              ) : file.mime_type.includes('pdf') || file.name.endsWith('.pdf') ? (
                <div className="text-center p-8 glass-card rounded-2xl border border-white/10 max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{file.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mb-4">
                    PDF Document · {file.size_text}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    This question paper / note is ready in your vault. You can open it in full resolution or save it to your local device.
                  </p>
                  {file.file_url && file.file_url !== '#' ? (
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Document Reader</span>
                    </a>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono inline-block">
                      Demo PDF Preview Sample
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 glass-card rounded-2xl border border-white/10 max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{file.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mb-6">
                    File Type: {getFileTypeInfo(file.name, file.mime_type).type} · Size: {file.size_text}
                  </p>
                  {file.file_url && file.file_url !== '#' && (
                    <a
                      href={file.file_url}
                      download={file.name}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary-gradient px-5 py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Archive</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Note Preview */}
          {note && (
            <div className="max-w-2xl mx-auto space-y-4">
              {note.is_pinned && (
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <Pin className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Pinned Note</span>
                </div>
              )}

              <h1 className="text-2xl font-bold text-white font-syne">{note.title}</h1>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-white/10 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {note.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
