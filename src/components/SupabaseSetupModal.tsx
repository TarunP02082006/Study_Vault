import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  HardDrive, 
  Key, 
  Layers 
} from 'lucide-react';
import { SupabaseConfig } from '../types';
import { SUPABASE_SETUP_SQL } from '../data/seedData';
import { testSupabaseConnection } from '../services/supabaseService';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onSaveConfig: (url: string, anonKey: string, isConnected: boolean) => void;
  onResetDemoData: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'guide'>('config');
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url.trim(), anonKey.trim());
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      onSaveConfig(url.trim(), anonKey.trim(), true);
    }
  };

  const handleSwitchToDemo = () => {
    onSaveConfig('', '', false);
    setUrl('');
    setAnonKey('');
    setTestResult({
      success: true,
      message: 'Switched to offline Demo Mode. All your files and notes are saved locally.',
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-dropdown w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3.5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-bold text-white font-syne truncate">
                Supabase Backend & Storage
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
                Connect project or use offline demo mode.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-3 sm:px-6 pt-3 sm:pt-4 border-b border-white/10 bg-white/[0.02] overflow-x-auto no-scrollbar touch-pan-x">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'config'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Credentials & Status
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sql'
                ? 'border-pink-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>SQL Schema</span>
            <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300">
              Copy
            </span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'guide'
                ? 'border-cyan-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Setup Guide
          </button>
        </div>

        {/* Tab 1: Connection & Credentials */}
        {activeTab === 'config' && (
          <form onSubmit={handleTestAndSave} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            {/* Status Banner */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-start gap-2.5 sm:gap-3 ${
                config.isConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              {config.isConnected ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-amber-400" />
              )}
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-xs sm:text-sm text-white mb-0.5">
                  {config.isConnected
                    ? 'Connected to Live Supabase Project'
                    : 'Running in Local Demo Mode'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300">
                  {config.isConnected
                    ? 'Your study subjects, question papers, notes, and uploaded files are synced in real time.'
                    : 'You can test every feature immediately! To sync to your cloud Supabase database, paste credentials below.'}
                </div>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                    : 'bg-red-500/15 border-red-500/30 text-red-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* URL Input */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Supabase Project URL</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">https://xyz.supabase.co</span>
              </label>
              <input
                type="url"
                placeholder="https://your-project-id.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full glass-input px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>

            {/* Anon Key Input */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Supabase Anon Public API Key</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">eyJhbGciOi...</span>
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full glass-input px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>

            {/* Storage Bucket Info */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span>Bucket:</span>
                <code className="font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 text-[11px]">
                  study-files
                </code>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400">Public bucket</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwitchToDemo}
                  className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-center"
                >
                  Demo Mode
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onResetDemoData();
                    onClose();
                  }}
                  className="px-2.5 py-2 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors text-center"
                >
                  Restore Sample
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 sm:w-auto px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white text-center"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={isTesting}
                  className="w-2/3 sm:w-auto btn-primary-gradient px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50 min-h-[38px]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Verifying...' : 'Save & Connect'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: SQL Script */}
        {activeTab === 'sql' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white font-syne">
                  Supabase PostgreSQL Setup Script
                </h4>
                <p className="text-xs text-slate-400">
                  Creates tables (<code className="text-violet-300">subjects</code>,{' '}
                  <code className="text-pink-300">files</code>,{' '}
                  <code className="text-cyan-300">notes</code>) and grants Row-Level Security policies.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="btn-primary-gradient px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-violet-600/30 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-[#080614] border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-80 select-all">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        )}

        {/* Tab 3: Step-by-Step Guide */}
        {activeTab === 'guide' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-300">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-card border border-white/10 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Create a free Supabase Project</h5>
                  <p className="text-slate-400 mt-1">
                    Go to{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-400 underline inline-flex items-center gap-1"
                    >
                      supabase.com <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and click "New Project". Choose any database password and region closest to you.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Run the SQL Schema</h5>
                  <p className="text-slate-400 mt-1">
                    Open the <strong>SQL Editor</strong> in your Supabase dashboard, click "New Query", paste
                    the script from the <strong>SQL Schema Script</strong> tab, and click <strong>Run</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Create the Storage Bucket</h5>
                  <p className="text-slate-400 mt-1">
                    In your Supabase sidebar, go to <strong>Storage</strong> → Click <strong>"New Bucket"</strong> →
                    Name it exactly <code className="text-cyan-300 bg-white/10 px-1 py-0.5 rounded">study-files</code> →
                    Toggle <strong>"Public bucket"</strong> to ON → Click Save.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Enter Credentials in StudyVault</h5>
                  <p className="text-slate-400 mt-1">
                    Go to <strong>Project Settings → API</strong> in Supabase, copy your{' '}
                    <strong>Project URL</strong> and <strong>anon public key</strong>, and paste them into the
                    credentials tab here. Click "Save & Connect"!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
