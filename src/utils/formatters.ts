import React from 'react';
import { 
  Book, 
  Brain, 
  Code2, 
  Palette, 
  Calculator, 
  Database, 
  Server, 
  Sparkles, 
  Atom, 
  Cpu, 
  Compass, 
  Layers, 
  GraduationCap,
  FileText,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  FileCheck
} from 'lucide-react';
import { SubjectColor } from '../types';

export const COLOR_THEMES: Record<SubjectColor, {
  name: string;
  gradient: string;
  border: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  accentHex: string;
  bgGlow: string;
}> = {
  violet: {
    name: 'Electric Violet',
    gradient: 'from-violet-600 to-indigo-600',
    border: 'border-violet-500/30 hover:border-violet-500/70',
    glow: 'rgba(124, 58, 237, 0.35)',
    badgeBg: 'bg-violet-500/15 border border-violet-500/30',
    badgeText: 'text-violet-300',
    accentHex: '#7C3AED',
    bgGlow: 'from-violet-600/20 via-transparent to-transparent',
  },
  pink: {
    name: 'Hot Pink',
    gradient: 'from-pink-600 to-rose-500',
    border: 'border-pink-500/30 hover:border-pink-500/70',
    glow: 'rgba(236, 72, 153, 0.35)',
    badgeBg: 'bg-pink-500/15 border border-pink-500/30',
    badgeText: 'text-pink-300',
    accentHex: '#EC4899',
    bgGlow: 'from-pink-600/20 via-transparent to-transparent',
  },
  cyan: {
    name: 'Cyan Glow',
    gradient: 'from-cyan-500 to-teal-500',
    border: 'border-cyan-500/30 hover:border-cyan-500/70',
    glow: 'rgba(6, 182, 212, 0.35)',
    badgeBg: 'bg-cyan-500/15 border border-cyan-500/30',
    badgeText: 'text-cyan-300',
    accentHex: '#06B6D4',
    bgGlow: 'from-cyan-600/20 via-transparent to-transparent',
  },
  amber: {
    name: 'Sun Amber',
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/30 hover:border-amber-500/70',
    glow: 'rgba(245, 158, 11, 0.35)',
    badgeBg: 'bg-amber-500/15 border border-amber-500/30',
    badgeText: 'text-amber-300',
    accentHex: '#F59E0B',
    bgGlow: 'from-amber-600/20 via-transparent to-transparent',
  },
  emerald: {
    name: 'Emerald Green',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/30 hover:border-emerald-500/70',
    glow: 'rgba(16, 185, 129, 0.35)',
    badgeBg: 'bg-emerald-500/15 border border-emerald-500/30',
    badgeText: 'text-emerald-300',
    accentHex: '#10B981',
    bgGlow: 'from-emerald-600/20 via-transparent to-transparent',
  },
  orange: {
    name: 'Bright Orange',
    gradient: 'from-orange-500 to-amber-600',
    border: 'border-orange-500/30 hover:border-orange-500/70',
    glow: 'rgba(249, 115, 22, 0.35)',
    badgeBg: 'bg-orange-500/15 border border-orange-500/30',
    badgeText: 'text-orange-300',
    accentHex: '#F97316',
    bgGlow: 'from-orange-600/20 via-transparent to-transparent',
  },
  blue: {
    name: 'Royal Blue',
    gradient: 'from-blue-600 to-cyan-600',
    border: 'border-blue-500/30 hover:border-blue-500/70',
    glow: 'rgba(37, 99, 235, 0.35)',
    badgeBg: 'bg-blue-500/15 border border-blue-500/30',
    badgeText: 'text-blue-300',
    accentHex: '#2563EB',
    bgGlow: 'from-blue-600/20 via-transparent to-transparent',
  },
};

export const AVAILABLE_ICONS = [
  { name: 'Book', label: 'Book', component: Book },
  { name: 'Brain', label: 'Brain / AI', component: Brain },
  { name: 'Code2', label: 'Code', component: Code2 },
  { name: 'Palette', label: 'Design', component: Palette },
  { name: 'Calculator', label: 'Math', component: Calculator },
  { name: 'Database', label: 'Database', component: Database },
  { name: 'Server', label: 'Server', component: Server },
  { name: 'Sparkles', label: 'Sparkles', component: Sparkles },
  { name: 'Atom', label: 'Science', component: Atom },
  { name: 'Cpu', label: 'Hardware', component: Cpu },
  { name: 'Compass', label: 'Architecture', component: Compass },
  { name: 'Layers', label: 'Systems', component: Layers },
  { name: 'GraduationCap', label: 'Academia', component: GraduationCap },
];

export function getSubjectIcon(iconName: string, className = 'w-5 h-5') {
  const found = AVAILABLE_ICONS.find(i => i.name.toLowerCase() === (iconName || '').toLowerCase());
  const IconComponent = found ? found.component : Book;
  return React.createElement(IconComponent, { className });
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}

export function getFileCategoryBadge(category: string) {
  switch (category) {
    case 'Question Papers':
      return { bg: 'bg-rose-500/10 text-rose-300 border border-rose-500/25', icon: '📝', color: 'rose' };
    case 'Notes':
      return { bg: 'bg-violet-500/10 text-violet-300 border border-violet-500/25', icon: '📚', color: 'violet' };
    case 'Mini Projects':
      return { bg: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25', icon: '⚡', color: 'cyan' };
    default:
      return { bg: 'bg-slate-500/10 text-slate-300 border border-slate-500/25', icon: '📁', color: 'slate' };
  }
}

export function getFileTypeInfo(fileName: string, mimeType?: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (mimeType?.includes('pdf') || ext === 'pdf') {
    return {
      type: 'PDF',
      color: '#EF4444',
      bgClass: 'bg-red-500/15 text-red-400 border border-red-500/30',
      icon: FileText,
    };
  }
  if (mimeType?.includes('image') || ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) {
    return {
      type: 'IMG',
      color: '#06B6D4',
      bgClass: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
      icon: ImageIcon,
    };
  }
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) {
    return {
      type: 'ZIP',
      color: '#F59E0B',
      bgClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      icon: FileArchive,
    };
  }
  if (['py', 'js', 'ts', 'jsx', 'tsx', 'cpp', 'c', 'java', 'go', 'rs', 'ipynb', 'json'].includes(ext)) {
    return {
      type: ext.toUpperCase(),
      color: '#10B981',
      bgClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      icon: FileCode,
    };
  }
  return {
    type: 'DOC',
    color: '#8B5CF6',
    bgClass: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    icon: FileCheck,
  };
}
