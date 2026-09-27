import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Database, 
  Plus, 
  Menu, 
  X, 
  CheckCircle2, 
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { SupabaseConfig, VaultStats } from '../types';

interface NavbarProps {
  stats: VaultStats;
  supabaseConfig: SupabaseConfig;
  onOpenSearch: () => void;
  onOpenAddSubject: () => void;
  onOpenSupabaseModal: () => void;
  onOpenAddNote: () => void;
  activeView: 'dashboard' | 'subject';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  supabaseConfig,
  onOpenSearch,
  onOpenAddSubject,
  onOpenSupabaseModal,
  onOpenAddNote,
  activeView,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0c0924]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight gradient-text-hero font-syne block leading-tight">
                StudyVault
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
            <button
              onClick={onNavigateHome}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'dashboard'
                  ? 'text-white bg-white/10'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                const el = document.getElementById('subjects-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
            >
              Subjects
            </button>
            <button
              onClick={onOpenAddNote}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
            >
              Quick Note
            </button>
            <button
              onClick={onOpenSupabaseModal}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-pink-400" />
              <span>Supabase SQL & Setup</span>
            </button>
          </nav>
        </div>

        {/* Center / Search & Live Stats */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Search trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-400 hover:text-slate-200 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all text-xs font-medium w-52 justify-between group shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 transition-colors" />
              <span>Search vault...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Stats Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-slate-400 font-mono">
            <span className="text-violet-300 font-semibold">{stats.totalSubjects}</span> sub
            <span className="text-slate-600">·</span>
            <span className="text-pink-300 font-semibold">{stats.totalFiles}</span> files
            <span className="text-slate-600">·</span>
            <span className="text-cyan-300 font-semibold">{stats.totalNotes}</span> notes
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium transition-all border ${
              supabaseConfig.isConnected
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Configure Supabase connection or use Local Demo mode"
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                supabaseConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="hidden sm:inline text-[11px] sm:text-xs">
              {supabaseConfig.isConnected ? 'Supabase Live' : 'Demo Mode'}
            </span>
          </button>

          {/* Search trigger on mobile */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Add Subject Action */}
          <button
            onClick={onOpenAddSubject}
            className="btn-primary-gradient px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-violet-600/30 whitespace-nowrap cursor-pointer min-h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Add</span>
            <span className="hidden sm:inline">Subject</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0c0924] px-4 pt-3 pb-6 space-y-2.5 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-4 gap-2 py-2 border-b border-white/10 text-[11px] text-slate-400 font-mono text-center">
            <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
              <div className="text-violet-300 font-bold text-xs">{stats.totalSubjects}</div>
              <div className="text-[10px] text-slate-400">Subjects</div>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
              <div className="text-pink-300 font-bold text-xs">{stats.totalFiles}</div>
              <div className="text-[10px] text-slate-400">Files</div>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
              <div className="text-cyan-300 font-bold text-xs">{stats.totalNotes}</div>
              <div className="text-[10px] text-slate-400">Notes</div>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
              <div className="text-amber-300 font-bold text-xs">{stats.storageText}</div>
              <div className="text-[10px] text-slate-400">Used</div>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2.5 min-h-[44px]"
          >
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
              const el = document.getElementById('subjects-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2.5 min-h-[44px]"
          >
            <Layers className="w-4 h-4 text-pink-400" />
            <span>All Subjects & Vaults</span>
          </button>

          <button
            onClick={() => {
              onOpenAddNote();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2.5 min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Create New Note</span>
          </button>

          <button
            onClick={() => {
              onOpenSupabaseModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-pink-300 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 flex items-center gap-2.5 min-h-[44px]"
          >
            <Database className="w-4 h-4 text-pink-400" />
            <span>Supabase Connection & SQL</span>
          </button>
        </div>
      )}
    </header>
  );
};
