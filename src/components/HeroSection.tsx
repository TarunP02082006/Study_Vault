import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  ArrowDown, 
  FolderSync, 
  Database, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Layers, 
  HardDrive,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { VaultStats } from '../types';

interface HeroSectionProps {
  stats: VaultStats;
  onOpenAddSubject: () => void;
  onOpenSupabaseModal: () => void;
  onScrollToSubjects: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onOpenAddSubject,
  onOpenSupabaseModal,
  onScrollToSubjects,
}) => {
  // Count-up animation state
  const [displayCounts, setDisplayCounts] = useState({
    subjects: 0,
    files: 0,
    notes: 0,
  });

  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayCounts({
        subjects: Math.round(stats.totalSubjects * ease),
        files: Math.round(stats.totalFiles * ease),
        notes: Math.round(stats.totalNotes * ease),
      });

      if (step >= steps) {
        clearInterval(timer);
        setDisplayCounts({
          subjects: stats.totalSubjects,
          files: stats.totalFiles,
          notes: stats.totalNotes,
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [stats.totalSubjects, stats.totalFiles, stats.totalNotes]);

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-violet-600/20 via-fuchsia-600/15 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Subheadline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Super kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-medium text-violet-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Personal Study Organization Architecture</span>
              <span className="text-violet-400/50">·</span>
              <span className="text-pink-300 font-semibold">Supabase Powered</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-syne leading-[1.15] sm:leading-[1.1] text-balance">
              Your Ultimate Study{' '}
              <span className="gradient-text-hero block sm:inline">Command Center</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed text-balance">
              Organize question papers, high-yield notes & mini projects — all in one premium,
              lightning-fast space with seamless Supabase cloud storage synchronization.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-2">
              <button
                onClick={onOpenAddSubject}
                className="btn-primary-gradient px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-600/40 cursor-pointer group min-h-[44px]"
              >
                <span>Get Started</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4">
                <button
                  onClick={onScrollToSubjects}
                  className="btn-secondary-glass px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Layers className="w-4 h-4 text-violet-400" />
                  <span>View Subjects</span>
                </button>

                <button
                  onClick={onOpenSupabaseModal}
                  className="px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl text-xs font-medium text-pink-300 hover:text-pink-200 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>SQL Schema</span>
                </button>
              </div>
            </div>

            {/* Trust / Capability Checklist */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 sm:gap-x-6 text-[11px] sm:text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Offline Safe</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant ⌘K</span>
              </span>
              <span className="flex items-center gap-1.5">
                <FolderSync className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supabase Storage</span>
              </span>
            </div>
          </div>

          {/* Right Column: Floating 3D Study Illustration & Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center px-2 sm:px-0">
            {/* Ambient Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 to-pink-600/20 blur-3xl rounded-full transform scale-75 animate-pulse-glow" />

            {/* Central 3D Isometric Card Cluster */}
            <div className="relative w-full max-w-[300px] sm:max-w-[360px] aspect-square flex items-center justify-center">
              {/* Center Glow Portal */}
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-br from-violet-900/60 via-purple-900/40 to-slate-900/80 border border-violet-500/30 backdrop-blur-2xl shadow-2xl shadow-purple-900/60 flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-float relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-pink-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40 mb-2 sm:mb-3 group-hover:rotate-6 transition-transform">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-syne">StudyVault Core</h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1 font-mono">
                  Autonomous Organization
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-300 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>3 Categories Ready</span>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-2 right-0 glass-card px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-violet-500/30 shadow-xl flex items-center gap-2 animate-float-delayed">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] sm:text-xs font-bold text-white whitespace-nowrap">25+ Files</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 hidden xs:block">PDFs & Docs</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-3 left-0 glass-card px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-cyan-500/30 shadow-xl flex items-center gap-2 animate-float">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] sm:text-xs font-bold text-white whitespace-nowrap">Subject Vaults</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 hidden xs:block">Color Coded</div>
                </div>
              </div>

              {/* Floating Badge 3: Bottom Right */}
              <div className="absolute bottom-4 right-0 glass-card px-2 py-1 rounded-lg border border-emerald-500/30 shadow-lg flex items-center gap-1.5 animate-float-delayed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] sm:text-[11px] font-mono text-emerald-300 font-medium">Cloud Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard Banner */}
        <div className="mt-10 sm:mt-20 pt-6 sm:pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Stat 1: Total Subjects */}
            <div className="glass-card p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-white/10 relative overflow-hidden group hover:border-violet-500/40 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-500" />
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">Total Subjects</div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white font-syne tabular-nums">
                {displayCounts.subjects}
              </div>
              <div className="text-[10px] sm:text-[11px] text-violet-300 mt-1 truncate">
                Color modules
              </div>
            </div>

            {/* Stat 2: Total Files */}
            <div className="glass-card p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-white/10 relative overflow-hidden group hover:border-pink-500/40 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">Files Stored</div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white font-syne tabular-nums">
                {displayCounts.files}
              </div>
              <div className="text-[10px] sm:text-[11px] text-pink-300 mt-1 truncate">
                Papers & code
              </div>
            </div>

            {/* Stat 3: Total Notes */}
            <div className="glass-card p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">Rich Notes</div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white font-syne tabular-nums">
                {displayCounts.notes}
              </div>
              <div className="text-[10px] sm:text-[11px] text-cyan-300 mt-1 truncate">
                Markdown
              </div>
            </div>

            {/* Stat 4: Estimated Storage */}
            <div className="glass-card p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">Storage Bandwidth</div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white font-syne tabular-nums">
                {stats.storageText}
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-300 mt-1 truncate flex items-center gap-1">
                <HardDrive className="w-3 h-3 shrink-0" />
                <span>study-files</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Arrow */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onScrollToSubjects}
            className="flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span>Explore Vault</span>
            <ArrowDown className="w-4 h-4 text-violet-400 group-hover:translate-y-1 transition-transform animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
