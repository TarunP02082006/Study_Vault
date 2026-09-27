import React from 'react';
import { BookOpen, Database, Heart, Sparkles, Shield, ArrowUp } from 'lucide-react';
import { VaultStats, SupabaseConfig } from '../types';

interface FooterProps {
  stats: VaultStats;
  supabaseConfig: SupabaseConfig;
  onOpenSupabaseModal: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  stats,
  supabaseConfig,
  onOpenSupabaseModal,
  onScrollToTop,
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#09071c]/90 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold gradient-text-hero font-syne">
                StudyVault
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              A personal study organization command center engineered for high-yield learning.
              Question papers, rich notes, and project archives synced with Supabase.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-2 text-xs text-slate-400">
            <div className="font-semibold text-white uppercase tracking-wider mb-2 font-syne">
              Vault Telemetry
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5 font-mono">
              <span>Active Subjects:</span>
              <span className="text-violet-300 font-bold">{stats.totalSubjects}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5 font-mono">
              <span>Organized Files:</span>
              <span className="text-pink-300 font-bold">{stats.totalFiles}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5 font-mono">
              <span>Rich Study Notes:</span>
              <span className="text-cyan-300 font-bold">{stats.totalNotes}</span>
            </div>
          </div>

          {/* Cloud Sync & Action */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs uppercase tracking-wider font-syne">
              Cloud Storage Sync
            </div>
            <button
              onClick={onOpenSupabaseModal}
              className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-pink-400" />
                <div>
                  <div className="font-bold text-white">
                    {supabaseConfig.isConnected ? 'Supabase Live' : 'Demo Local Mode'}
                  </div>
                  <div className="text-[10px] text-slate-400">Manage API keys & SQL</div>
                </div>
              </div>
              <span className="text-violet-400 text-xs font-semibold">Config →</span>
            </button>

            <button
              onClick={onScrollToTop}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} StudyVault · Personal Education Portal</div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Powered by Supabase JS & Storage</span>
            <span>·</span>
            <span>Zero Slop High-Density Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
