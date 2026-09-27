import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Subject, StudyFile, StudyNote, SupabaseConfig, VaultStats } from '../types';
import { INITIAL_SUBJECTS, INITIAL_FILES, INITIAL_NOTES } from '../data/seedData';

const CONFIG_KEY = 'studyvault_supabase_config';
const SUBJECTS_KEY = 'studyvault_local_subjects';
const FILES_KEY = 'studyvault_local_files';
const NOTES_KEY = 'studyvault_local_notes';

let supabaseInstance: SupabaseClient | null = null;

// Initialize Supabase configuration from localStorage or default demo
export function getSavedConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        url: parsed.url || '',
        anonKey: parsed.anonKey || '',
        bucketName: parsed.bucketName || 'study-files',
        isConnected: Boolean(parsed.isConnected && parsed.url && parsed.anonKey),
        isDemoMode: Boolean(!parsed.isConnected || !parsed.url || !parsed.anonKey),
      };
    }
  } catch (e) {
    console.warn('Failed to parse Supabase config from storage', e);
  }

  return {
    url: '',
    anonKey: '',
    bucketName: 'study-files',
    isConnected: false,
    isDemoMode: true,
  };
}

export function getClient(): SupabaseClient | null {
  const config = getSavedConfig();
  if (config.isConnected && config.url && config.anonKey) {
    if (!supabaseInstance) {
      try {
        supabaseInstance = createClient(config.url, config.anonKey);
      } catch (e) {
        console.error('Error creating Supabase client:', e);
        return null;
      }
    }
    return supabaseInstance;
  }
  return null;
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL and Anon Key are required.' };
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { success: false, message: 'Supabase URL must start with https://' };
  }

  try {
    const testClient = createClient(url, anonKey);
    const { error } = await testClient.from('subjects').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.subjects" does not exist')) {
        return { 
          success: false, 
          message: 'Connected to Supabase, but the "subjects" table does not exist yet. Please run the SQL schema in your Supabase SQL Editor.' 
        };
      }
      return { success: false, message: `Connection error: ${error.message}` };
    }
    
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to reach Supabase project.' };
  }
}

export function saveConfig(config: Partial<SupabaseConfig>): SupabaseConfig {
  const current = getSavedConfig();
  const updated: SupabaseConfig = {
    ...current,
    ...config,
    isDemoMode: !config.isConnected || !config.url || !config.anonKey,
  };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  supabaseInstance = null; // reset client instance
  return updated;
}

// Local Storage Helper Utilities
function getLocalSubjects(): Subject[] {
  try {
    const data = localStorage.getItem(SUBJECTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local subjects', e);
  }
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
  return INITIAL_SUBJECTS;
}

function saveLocalSubjects(subjects: Subject[]) {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

function getLocalFiles(): StudyFile[] {
  try {
    const data = localStorage.getItem(FILES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local files', e);
  }
  localStorage.setItem(FILES_KEY, JSON.stringify(INITIAL_FILES));
  return INITIAL_FILES;
}

function saveLocalFiles(files: StudyFile[]) {
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
}

function getLocalNotes(): StudyNote[] {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local notes', e);
  }
  localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
  return INITIAL_NOTES;
}

function saveLocalNotes(notes: StudyNote[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// Data Operations with Supabase + Local Fallback

export async function fetchSubjects(): Promise<Subject[]> {
  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Subject[];
      }
      console.warn('Supabase fetchSubjects error, falling back to local storage:', error?.message);
    } catch (e) {
      console.warn('Supabase fetchSubjects exception, falling back:', e);
    }
  }
  return getLocalSubjects();
}

export async function createSubject(subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> {
  const newSubject: Subject = {
    ...subject,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('subjects')
        .insert([{
          name: newSubject.name,
          description: newSubject.description,
          color: newSubject.color,
          icon: newSubject.icon,
        }])
        .select()
        .single();
      if (!error && data) {
        // Also sync local
        const local = getLocalSubjects();
        saveLocalSubjects([data as Subject, ...local]);
        return data as Subject;
      }
    } catch (e) {
      console.error('Supabase createSubject error:', e);
    }
  }

  const local = getLocalSubjects();
  const updated = [newSubject, ...local];
  saveLocalSubjects(updated);
  return newSubject;
}

export async function updateSubject(id: string, updates: Partial<Subject>): Promise<Subject | null> {
  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('subjects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const local = getLocalSubjects().map(s => s.id === id ? { ...s, ...data } : s);
        saveLocalSubjects(local);
        return data as Subject;
      }
    } catch (e) {
      console.error('Supabase updateSubject error:', e);
    }
  }

  const local = getLocalSubjects();
  let updatedSubject: Subject | null = null;
  const updated = local.map(s => {
    if (s.id === id) {
      updatedSubject = { ...s, ...updates, updated_at: new Date().toISOString() };
      return updatedSubject;
    }
    return s;
  });
  saveLocalSubjects(updated);
  return updatedSubject;
}

export async function deleteSubject(id: string): Promise<boolean> {
  const client = getClient();
  if (client) {
    try {
      await client.from('subjects').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteSubject error:', e);
    }
  }

  const localSubjects = getLocalSubjects().filter(s => s.id !== id);
  const localFiles = getLocalFiles().filter(f => f.subject_id !== id);
  const localNotes = getLocalNotes().filter(n => n.subject_id !== id);
  saveLocalSubjects(localSubjects);
  saveLocalFiles(localFiles);
  saveLocalNotes(localNotes);
  return true;
}

// File Operations
export async function fetchFiles(subjectId?: string): Promise<StudyFile[]> {
  const client = getClient();
  if (client) {
    try {
      let query = client.from('files').select('*').order('created_at', { ascending: false });
      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as StudyFile[];
      }
    } catch (e) {
      console.warn('Supabase fetchFiles error:', e);
    }
  }

  const all = getLocalFiles();
  return subjectId ? all.filter(f => f.subject_id === subjectId) : all;
}

export async function uploadStudyFile(
  file: File,
  subjectId: string,
  category: StudyFile['category'],
  onProgress?: (percent: number) => void
): Promise<StudyFile> {
  const client = getClient();
  const config = getSavedConfig();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${subjectId}/${category}/${Date.now()}_${cleanFileName}`;

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const sizeText = formatSize(file.size);

  if (onProgress) onProgress(30);

  if (client && config.bucketName) {
    try {
      if (onProgress) onProgress(60);
      const { error: uploadError } = await client.storage
        .from(config.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data: { publicUrl } } = client.storage
          .from(config.bucketName)
          .getPublicUrl(filePath);

        const { data: dbFile, error: dbError } = await client
          .from('files')
          .insert([{
            subject_id: subjectId,
            name: file.name,
            category,
            file_url: publicUrl,
            file_path: filePath,
            mime_type: file.type || 'application/octet-stream',
            size_text: sizeText,
          }])
          .select()
          .single();

        if (!dbError && dbFile) {
          if (onProgress) onProgress(100);
          const local = getLocalFiles();
          saveLocalFiles([dbFile as StudyFile, ...local]);
          return dbFile as StudyFile;
        }
      } else {
        console.warn('Supabase storage upload error, falling back to client simulation:', uploadError.message);
      }
    } catch (e) {
      console.error('Supabase upload exception:', e);
    }
  }

  // Local fallback: create object URL or base64 data for images/docs
  let fileUrl = '#';
  if (file.type.startsWith('image/')) {
    fileUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '#');
      reader.onerror = () => resolve('#');
      reader.readAsDataURL(file);
    });
  } else {
    fileUrl = URL.createObjectURL(file);
  }

  if (onProgress) onProgress(90);

  const newFile: StudyFile = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `file-${Date.now()}`,
    subject_id: subjectId,
    name: file.name,
    category,
    file_url: fileUrl,
    file_path: filePath,
    mime_type: file.type || 'application/octet-stream',
    size_text: sizeText,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_demo: false,
  };

  if (onProgress) onProgress(100);

  const local = getLocalFiles();
  saveLocalFiles([newFile, ...local]);
  return newFile;
}

export async function deleteStudyFile(id: string, filePath: string): Promise<boolean> {
  const client = getClient();
  const config = getSavedConfig();

  if (client) {
    try {
      if (filePath && config.bucketName) {
        await client.storage.from(config.bucketName).remove([filePath]);
      }
      await client.from('files').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete file error:', e);
    }
  }

  const local = getLocalFiles().filter(f => f.id !== id);
  saveLocalFiles(local);
  return true;
}

// Notes Operations
export async function fetchNotes(subjectId?: string): Promise<StudyNote[]> {
  const client = getClient();
  if (client) {
    try {
      let query = client.from('notes').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as StudyNote[];
      }
    } catch (e) {
      console.warn('Supabase fetchNotes error:', e);
    }
  }

  const all = getLocalNotes();
  return subjectId ? all.filter(n => n.subject_id === subjectId) : all;
}

export async function createStudyNote(note: Omit<StudyNote, 'id' | 'created_at' | 'updated_at'>): Promise<StudyNote> {
  const newNote: StudyNote = {
    ...note,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`,
    tags: note.tags || [],
    is_pinned: Boolean(note.is_pinned),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('notes')
        .insert([{
          subject_id: newNote.subject_id,
          title: newNote.title,
          content: newNote.content,
          category: newNote.category,
          tags: newNote.tags,
          is_pinned: newNote.is_pinned,
        }])
        .select()
        .single();
      if (!error && data) {
        const local = getLocalNotes();
        saveLocalNotes([data as StudyNote, ...local]);
        return data as StudyNote;
      }
    } catch (e) {
      console.error('Supabase createNote error:', e);
    }
  }

  const local = getLocalNotes();
  saveLocalNotes([newNote, ...local]);
  return newNote;
}

export async function updateStudyNote(id: string, updates: Partial<StudyNote>): Promise<StudyNote | null> {
  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const local = getLocalNotes().map(n => n.id === id ? { ...n, ...data } : n);
        saveLocalNotes(local);
        return data as StudyNote;
      }
    } catch (e) {
      console.error('Supabase updateNote error:', e);
    }
  }

  const local = getLocalNotes();
  let updatedNote: StudyNote | null = null;
  const updated = local.map(n => {
    if (n.id === id) {
      updatedNote = { ...n, ...updates, updated_at: new Date().toISOString() };
      return updatedNote;
    }
    return n;
  });
  saveLocalNotes(updated);
  return updatedNote;
}

export async function deleteStudyNote(id: string): Promise<boolean> {
  const client = getClient();
  if (client) {
    try {
      await client.from('notes').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteNote error:', e);
    }
  }

  const local = getLocalNotes().filter(n => n.id !== id);
  saveLocalNotes(local);
  return true;
}

// Global Search
export async function searchAll(query: string): Promise<{
  subjects: Subject[];
  files: (StudyFile & { subjectName?: string; subjectColor?: string })[];
  notes: (StudyNote & { subjectName?: string; subjectColor?: string })[];
}> {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { subjects: [], files: [], notes: [] };
  }

  const subjects = await fetchSubjects();
  const files = await fetchFiles();
  const notes = await fetchNotes();

  const subjectMap = new Map<string, Subject>();
  subjects.forEach(s => subjectMap.set(s.id, s));

  const matchedSubjects = subjects.filter(
    s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  );

  const matchedFiles = files
    .filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
    .map(f => {
      const sub = subjectMap.get(f.subject_id);
      return {
        ...f,
        subjectName: sub?.name || 'General',
        subjectColor: sub?.color || 'violet',
      };
    });

  const matchedNotes = notes
    .filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
    )
    .map(n => {
      const sub = subjectMap.get(n.subject_id);
      return {
        ...n,
        subjectName: sub?.name || 'General',
        subjectColor: sub?.color || 'violet',
      };
    });

  return {
    subjects: matchedSubjects,
    files: matchedFiles,
    notes: matchedNotes,
  };
}

// Calculate Portal Statistics
export async function calculateStats(): Promise<VaultStats> {
  const subjects = await fetchSubjects();
  const files = await fetchFiles();
  const notes = await fetchNotes();

  let approxBytes = 0;
  files.forEach(f => {
    if (f.size_text.includes('MB')) {
      approxBytes += parseFloat(f.size_text) * 1024 * 1024;
    } else if (f.size_text.includes('KB')) {
      approxBytes += parseFloat(f.size_text) * 1024;
    } else {
      approxBytes += 500 * 1024;
    }
  });

  const formatStorage = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return {
    totalSubjects: subjects.length,
    totalFiles: files.length,
    totalNotes: notes.length,
    totalStorageBytes: approxBytes,
    storageText: formatStorage(approxBytes),
  };
}

export function resetDemoData() {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
  localStorage.setItem(FILES_KEY, JSON.stringify(INITIAL_FILES));
  localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
}
