import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Subject, StudyFile, StudyNote, SupabaseConfig, VaultStats } from '../types';
import { INITIAL_SUBJECTS, INITIAL_FILES, INITIAL_NOTES } from '../data/seedData';

const CONFIG_KEY = 'studyvault_supabase_config';
const SUBJECTS_KEY = 'studyvault_local_subjects_v3';
const FILES_KEY = 'studyvault_local_files_v3';
const NOTES_KEY = 'studyvault_local_notes_v3';
const INIT_FLAG_KEY = 'studyvault_initialized_v3';

let supabaseInstance: SupabaseClient | null = null;

// UUID validation helper
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Initialize Supabase configuration from localStorage or env variables
export function getSavedConfig(): SupabaseConfig {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL as string || '') : '';
  const envAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string || '') : '';

  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const url = (parsed.url || envUrl || '').trim();
      const anonKey = (parsed.anonKey || envAnonKey || '').trim();
      const isConnected = Boolean(parsed.isConnected && url && anonKey);
      return {
        url,
        anonKey,
        bucketName: parsed.bucketName || 'study-files',
        isConnected,
        isDemoMode: !isConnected,
      };
    }
  } catch (e) {
    console.warn('Failed to parse Supabase config from storage', e);
  }

  if (envUrl && envAnonKey) {
    return {
      url: envUrl.trim(),
      anonKey: envAnonKey.trim(),
      bucketName: 'study-files',
      isConnected: true,
      isDemoMode: false,
    };
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
        supabaseInstance = createClient(config.url, config.anonKey, {
          auth: {
            persistSession: false,
          },
        });
      } catch (e) {
        console.error('Error creating Supabase client:', e);
        return null;
      }
    }
    return supabaseInstance;
  }
  return null;
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ 
  success: boolean; 
  message: string; 
  tablesFound?: { subjects: boolean; files: boolean; notes: boolean };
  bucketFound?: boolean;
}> {
  if (!url || !anonKey) {
    return { success: false, message: 'Supabase URL and Anon Key are required.' };
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { success: false, message: 'Supabase URL must start with https://' };
  }

  try {
    const testClient = createClient(url, anonKey, { auth: { persistSession: false } });
    
    // Check tables
    const { error: subErr } = await testClient.from('subjects').select('id', { head: true, count: 'exact' });
    const { error: fileErr } = await testClient.from('files').select('id', { head: true, count: 'exact' });
    const { error: noteErr } = await testClient.from('notes').select('id', { head: true, count: 'exact' });

    const tablesFound = {
      subjects: !subErr,
      files: !fileErr,
      notes: !noteErr,
    };

    if (subErr || fileErr || noteErr) {
      const missing = [];
      if (subErr) missing.push('subjects');
      if (fileErr) missing.push('files');
      if (noteErr) missing.push('notes');
      return {
        success: false,
        message: `Connected to Supabase, but missing table(s): ${missing.join(', ')}. Please run the SQL schema in your Supabase SQL Editor.`,
        tablesFound,
      };
    }

    // Check storage bucket
    let bucketFound = false;
    try {
      const { data: buckets } = await testClient.storage.listBuckets();
      bucketFound = Boolean(buckets?.some((b: any) => b.name === 'study-files' || b.id === 'study-files'));
    } catch {
      bucketFound = false;
    }

    return { 
      success: true, 
      message: bucketFound 
        ? 'Successfully connected to Supabase database and "study-files" bucket!' 
        : 'Connected to Supabase tables! (Note: create "study-files" public bucket for storage or run the full SQL script).',
      tablesFound,
      bucketFound,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to reach Supabase project.' };
  }
}

export function saveConfig(config: Partial<SupabaseConfig>): SupabaseConfig {
  const current = getSavedConfig();
  const url = (config.url ?? current.url).trim();
  const anonKey = (config.anonKey ?? current.anonKey).trim();
  const isConnected = Boolean(config.isConnected && url && anonKey);

  const updated: SupabaseConfig = {
    url,
    anonKey,
    bucketName: config.bucketName || current.bucketName || 'study-files',
    isConnected,
    isDemoMode: !isConnected,
  };

  localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  supabaseInstance = null; // reset client instance
  return updated;
}

// Local Storage Helper Utilities
function ensureInitialized() {
  try {
    const isInit = localStorage.getItem(INIT_FLAG_KEY);
    if (!isInit) {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
      localStorage.setItem(FILES_KEY, JSON.stringify(INITIAL_FILES));
      localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
      localStorage.setItem(INIT_FLAG_KEY, 'true');
    }
  } catch (e) {
    console.warn('Storage init check notice', e);
  }
}

export function getLocalSubjects(): Subject[] {
  ensureInitialized();
  try {
    const data = localStorage.getItem(SUBJECTS_KEY);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local subjects', e);
  }
  return INITIAL_SUBJECTS;
}

export function saveLocalSubjects(subjects: Subject[]) {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

export function getLocalFiles(): StudyFile[] {
  ensureInitialized();
  try {
    const data = localStorage.getItem(FILES_KEY);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local files', e);
  }
  return INITIAL_FILES;
}

export function saveLocalFiles(files: StudyFile[]) {
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
}

export function getLocalNotes(): StudyNote[] {
  ensureInitialized();
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local notes', e);
  }
  return INITIAL_NOTES;
}

export function saveLocalNotes(notes: StudyNote[]) {
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
      
      if (!error && Array.isArray(data)) {
        // Return EXACT live subjects from Supabase
        return data as Subject[];
      }
      console.warn('Supabase fetchSubjects error:', error?.message);
    } catch (e) {
      console.warn('Supabase fetchSubjects exception:', e);
    }
  }
  return getLocalSubjects();
}

export async function createSubject(subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> {
  const id = generateUUID();
  const now = new Date().toISOString();
  const newSubject: Subject = {
    ...subject,
    id,
    created_at: now,
    updated_at: now,
  };

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('subjects')
        .insert([{
          id: newSubject.id,
          name: newSubject.name,
          description: newSubject.description,
          color: newSubject.color,
          icon: newSubject.icon,
          created_at: newSubject.created_at,
          updated_at: newSubject.updated_at,
        }])
        .select()
        .single();
      
      if (!error && data) {
        const local = getLocalSubjects();
        saveLocalSubjects([data as Subject, ...local.filter(s => s.id !== (data as Subject).id)]);
        return data as Subject;
      }
      if (error) {
        console.error('Supabase createSubject error:', error.message);
        throw new Error(`Supabase DB Error: ${error.message}`);
      }
    } catch (e: any) {
      console.error('Supabase createSubject error:', e);
      throw e;
    }
  }

  const local = getLocalSubjects();
  const updated = [newSubject, ...local];
  saveLocalSubjects(updated);
  return newSubject;
}

export async function updateSubject(id: string, updates: Partial<Subject>): Promise<Subject | null> {
  const now = new Date().toISOString();
  const client = getClient();
  
  if (client) {
    try {
      const { data, error } = await client
        .from('subjects')
        .update({
          ...updates,
          updated_at: now,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (!error && data) {
        const local = getLocalSubjects().map(s => s.id === id ? { ...s, ...data } : s);
        saveLocalSubjects(local);
        return data as Subject;
      }
      if (error) {
        console.error('Supabase updateSubject error:', error.message);
      }
    } catch (e) {
      console.error('Supabase updateSubject error:', e);
    }
  }

  const local = getLocalSubjects();
  let updatedSubject: Subject | null = null;
  const updated = local.map(s => {
    if (s.id === id) {
      updatedSubject = { ...s, ...updates, updated_at: now };
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
      if (!error && Array.isArray(data)) {
        // Return EXACT live files from Supabase database table editor (no merging fake demo items!)
        return data as StudyFile[];
      }
      console.warn('Supabase fetchFiles error:', error?.message);
    } catch (e) {
      console.warn('Supabase fetchFiles error:', e);
    }
  }

  const local = getLocalFiles();
  return subjectId ? local.filter(f => f.subject_id === subjectId) : local;
}

export async function uploadStudyFile(
  file: File,
  subjectId: string,
  category: StudyFile['category'],
  onProgress?: (percent: number) => void
): Promise<StudyFile> {
  const client = getClient();
  const config = getSavedConfig();
  const fileId = generateUUID();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${subjectId}/${category}/${Date.now()}_${cleanFileName}`;

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const sizeText = formatSize(file.size);
  const now = new Date().toISOString();

  if (onProgress) onProgress(20);

  // Generate fallback data URL
  let fallbackUrl = '#';
  try {
    if (file.type.startsWith('image/')) {
      fallbackUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || '#');
        reader.onerror = () => resolve('#');
        reader.readAsDataURL(file);
      });
    } else {
      fallbackUrl = URL.createObjectURL(file);
    }
  } catch (err) {
    fallbackUrl = '#';
  }

  if (onProgress) onProgress(40);

  if (client) {
    // Step 0: Verify or create subject in Supabase to ensure foreign key constraint passes
    try {
      const { data: existingSub } = await client
        .from('subjects')
        .select('id')
        .eq('id', subjectId)
        .maybeSingle();

      if (!existingSub) {
        // Find subject info from local
        const localSubs = getLocalSubjects();
        const found = localSubs.find(s => s.id === subjectId);
        const subToInsert = {
          id: subjectId,
          name: found?.name || 'General Subject',
          description: found?.description || '',
          color: found?.color || 'violet',
          icon: found?.icon || 'Book',
          created_at: found?.created_at || now,
          updated_at: now,
        };
        await client.from('subjects').upsert([subToInsert]);
      }
    } catch (subSyncErr) {
      console.warn('Notice while checking subject in Supabase:', subSyncErr);
    }

    if (onProgress) onProgress(60);

    let publicUrl = '';

    // Step 1: Upload to Supabase Storage bucket
    const targetBucket = config.bucketName || 'study-files';
    try {
      const { error: uploadError } = await client.storage
        .from(targetBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = client.storage
          .from(targetBucket)
          .getPublicUrl(filePath);
        publicUrl = urlData?.publicUrl || '';
      } else {
        console.warn('Supabase storage upload notice:', uploadError.message);
      }
    } catch (storageEx) {
      console.warn('Supabase storage exception (will still record file in DB table):', storageEx);
    }

    if (onProgress) onProgress(80);

    // Step 2: Insert into Supabase "files" table
    const fileRecord = {
      id: fileId,
      subject_id: subjectId,
      name: file.name,
      category,
      file_url: publicUrl || fallbackUrl,
      file_path: filePath,
      mime_type: file.type || 'application/octet-stream',
      size_text: sizeText,
      created_at: now,
      updated_at: now,
    };

    const { data: dbFile, error: dbError } = await client
      .from('files')
      .insert([fileRecord])
      .select()
      .single();

    if (!dbError && dbFile) {
      if (onProgress) onProgress(100);
      const local = getLocalFiles();
      saveLocalFiles([dbFile as StudyFile, ...local.filter(f => f.id !== (dbFile as StudyFile).id)]);
      return dbFile as StudyFile;
    }

    if (dbError) {
      console.error('Supabase files table insert error:', dbError.message);
      throw new Error(`Failed to insert file to Supabase table: ${dbError.message}`);
    }
  }

  if (onProgress) onProgress(100);

  // Local Storage Save (Demo mode)
  const newFile: StudyFile = {
    id: fileId,
    subject_id: subjectId,
    name: file.name,
    category,
    file_url: fallbackUrl,
    file_path: filePath,
    mime_type: file.type || 'application/octet-stream',
    size_text: sizeText,
    created_at: now,
    updated_at: now,
    is_demo: false,
  };

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
      if (!error && Array.isArray(data)) {
        return data as StudyNote[];
      }
      console.warn('Supabase fetchNotes error:', error?.message);
    } catch (e) {
      console.warn('Supabase fetchNotes error:', e);
    }
  }

  const all = getLocalNotes();
  return subjectId ? all.filter(n => n.subject_id === subjectId) : all;
}

export async function createStudyNote(note: Omit<StudyNote, 'id' | 'created_at' | 'updated_at'>): Promise<StudyNote> {
  const id = generateUUID();
  const now = new Date().toISOString();
  const newNote: StudyNote = {
    ...note,
    id,
    tags: note.tags || [],
    is_pinned: Boolean(note.is_pinned),
    created_at: now,
    updated_at: now,
  };

  const client = getClient();
  if (client) {
    try {
      // Ensure subject exists in Supabase
      const { data: existingSub } = await client
        .from('subjects')
        .select('id')
        .eq('id', newNote.subject_id)
        .maybeSingle();

      if (!existingSub) {
        const localSubs = getLocalSubjects();
        const found = localSubs.find(s => s.id === newNote.subject_id);
        await client.from('subjects').upsert([{
          id: newNote.subject_id,
          name: found?.name || 'General Subject',
          description: found?.description || '',
          color: found?.color || 'violet',
          icon: found?.icon || 'Book',
          created_at: found?.created_at || now,
          updated_at: now,
        }]);
      }

      const { data, error } = await client
        .from('notes')
        .insert([{
          id: newNote.id,
          subject_id: newNote.subject_id,
          title: newNote.title,
          content: newNote.content,
          category: newNote.category,
          tags: newNote.tags,
          is_pinned: newNote.is_pinned,
          created_at: now,
          updated_at: now,
        }])
        .select()
        .single();
      
      if (!error && data) {
        const local = getLocalNotes();
        saveLocalNotes([data as StudyNote, ...local.filter(n => n.id !== (data as StudyNote).id)]);
        return data as StudyNote;
      }
      if (error) {
        throw new Error(`Supabase notes table error: ${error.message}`);
      }
    } catch (e: any) {
      console.error('Supabase createNote error:', e);
      throw e;
    }
  }

  const local = getLocalNotes();
  saveLocalNotes([newNote, ...local]);
  return newNote;
}

export async function updateStudyNote(id: string, updates: Partial<StudyNote>): Promise<StudyNote | null> {
  const now = new Date().toISOString();
  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('notes')
        .update({
          ...updates,
          updated_at: now,
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
      updatedNote = { ...n, ...updates, updated_at: now };
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

// Push all local data to Supabase in one click
export async function syncLocalDataToSupabase(): Promise<{ 
  success: boolean; 
  message: string; 
  syncedSubjects: number; 
  syncedFiles: number; 
  syncedNotes: number 
}> {
  const client = getClient();
  if (!client) {
    return { success: false, message: 'Please connect to Supabase first with your URL and Anon Key.', syncedSubjects: 0, syncedFiles: 0, syncedNotes: 0 };
  }

  try {
    const localSubjects = getLocalSubjects();
    const localFiles = getLocalFiles();
    const localNotes = getLocalNotes();

    // 1. Sync subjects
    if (localSubjects.length > 0) {
      const formattedSubjects = localSubjects.map(s => ({
        id: isValidUUID(s.id) ? s.id : generateUUID(),
        name: s.name,
        description: s.description || '',
        color: s.color || 'violet',
        icon: s.icon || 'Book',
        created_at: s.created_at || new Date().toISOString(),
        updated_at: s.updated_at || new Date().toISOString(),
      }));

      const { error: subErr } = await client.from('subjects').upsert(formattedSubjects);
      if (subErr) throw new Error(`Subjects sync error: ${subErr.message}`);
    }

    // 2. Sync files
    let fileCount = 0;
    if (localFiles.length > 0) {
      const formattedFiles = localFiles.map(f => ({
        id: isValidUUID(f.id) ? f.id : generateUUID(),
        subject_id: f.subject_id,
        name: f.name,
        category: f.category,
        file_url: f.file_url || '#',
        file_path: f.file_path || `${f.subject_id}/${f.category}/${f.name}`,
        mime_type: f.mime_type || 'application/octet-stream',
        size_text: f.size_text || '1.0 MB',
        created_at: f.created_at || new Date().toISOString(),
        updated_at: f.updated_at || new Date().toISOString(),
      }));

      const { error: fileErr } = await client.from('files').upsert(formattedFiles);
      if (!fileErr) fileCount = formattedFiles.length;
    }

    // 3. Sync notes
    let noteCount = 0;
    if (localNotes.length > 0) {
      const formattedNotes = localNotes.map(n => ({
        id: isValidUUID(n.id) ? n.id : generateUUID(),
        subject_id: n.subject_id,
        title: n.title,
        content: n.content,
        category: n.category,
        tags: n.tags || [],
        is_pinned: Boolean(n.is_pinned),
        created_at: n.created_at || new Date().toISOString(),
        updated_at: n.updated_at || new Date().toISOString(),
      }));

      const { error: noteErr } = await client.from('notes').upsert(formattedNotes);
      if (!noteErr) noteCount = formattedNotes.length;
    }

    return {
      success: true,
      message: `Successfully synced ${localSubjects.length} subjects, ${fileCount} files, and ${noteCount} notes to Supabase!`,
      syncedSubjects: localSubjects.length,
      syncedFiles: fileCount,
      syncedNotes: noteCount,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to sync data to Supabase.',
      syncedSubjects: 0,
      syncedFiles: 0,
      syncedNotes: 0,
    };
  }
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
    s => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))
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
    if (f.size_text && f.size_text.includes('MB')) {
      approxBytes += parseFloat(f.size_text) * 1024 * 1024;
    } else if (f.size_text && f.size_text.includes('KB')) {
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

// Clear all demo/sample data so user has clean slate
export function clearAllDemoData() {
  localStorage.setItem(FILES_KEY, JSON.stringify([]));
  localStorage.setItem(INIT_FLAG_KEY, 'true');
}

export function resetDemoData() {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
  localStorage.setItem(FILES_KEY, JSON.stringify(INITIAL_FILES));
  localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
  localStorage.setItem(INIT_FLAG_KEY, 'true');
}

// Live Realtime Subscriptions for Supabase DB changes
export function subscribeToSupabaseChanges(onUpdate: () => void): () => void {
  const client = getClient();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('studyvault_db_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'files' },
        () => {
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subjects' },
        () => {
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Realtime subscription notice:', e);
    return () => {};
  }
}

