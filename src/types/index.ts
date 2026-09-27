export type SubjectColor = 'violet' | 'pink' | 'cyan' | 'amber' | 'emerald' | 'orange' | 'blue';

export type FileCategory = 'Question Papers' | 'Notes' | 'Mini Projects';

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: SubjectColor;
  icon: string;
  created_at: string;
  updated_at: string;
  file_count?: number;
  note_count?: number;
}

export interface StudyFile {
  id: string;
  subject_id: string;
  name: string;
  category: FileCategory;
  file_url: string;
  file_path: string;
  mime_type: string;
  size_text: string;
  created_at: string;
  updated_at: string;
  is_demo?: boolean;
}

export interface StudyNote {
  id: string;
  subject_id: string;
  title: string;
  content: string;
  category: FileCategory;
  tags?: string[];
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  bucketName: string;
  isConnected: boolean;
  isDemoMode: boolean;
}

export interface VaultStats {
  totalSubjects: number;
  totalFiles: number;
  totalNotes: number;
  totalStorageBytes: number;
  storageText: string;
}
