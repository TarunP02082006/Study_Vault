/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SubjectGrid } from './components/SubjectGrid';
import { SubjectDetailView } from './components/SubjectDetailView';
import { AddSubjectModal } from './components/AddSubjectModal';
import { NoteEditorModal } from './components/NoteEditorModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Footer } from './components/Footer';

import { Subject, StudyFile, StudyNote, FileCategory, SupabaseConfig, VaultStats } from './types';
import { 
  getSavedConfig, 
  saveConfig, 
  fetchSubjects, 
  fetchFiles, 
  fetchNotes, 
  createSubject, 
  updateSubject, 
  deleteSubject, 
  uploadStudyFile, 
  deleteStudyFile, 
  createStudyNote, 
  updateStudyNote, 
  deleteStudyNote, 
  calculateStats,
  resetDemoData
} from './services/supabaseService';

export default function App() {
  // App State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [files, setFiles] = useState<StudyFile[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [stats, setStats] = useState<VaultStats>({
    totalSubjects: 0,
    totalFiles: 0,
    totalNotes: 0,
    totalStorageBytes: 0,
    storageText: '0 KB',
  });
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getSavedConfig());
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editNote, setEditNote] = useState<StudyNote | null>(null);
  const [defaultNoteCategory, setDefaultNoteCategory] = useState<FileCategory>('Notes');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<StudyFile | null>(null);
  const [previewNote, setPreviewNote] = useState<StudyNote | null>(null);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    itemType: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    itemType: 'item',
    onConfirm: () => {},
  });

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      const [subs, fs, ns, st] = await Promise.all([
        fetchSubjects(),
        fetchFiles(),
        fetchNotes(),
        calculateStats(),
      ]);

      // Calculate file_count and note_count per subject
      const enrichedSubs = subs.map((sub) => ({
        ...sub,
        file_count: fs.filter((f) => f.subject_id === sub.id).length,
        note_count: ns.filter((n) => n.subject_id === sub.id).length,
      }));

      setSubjects(enrichedSubs);
      setFiles(fs);
      setNotes(ns);
      setStats(st);

      // If active subject exists, update reference
      if (activeSubject) {
        const found = enrichedSubs.find((s) => s.id === activeSubject.id);
        if (found) setActiveSubject(found);
      }
    } catch (err) {
      console.error('Error loading vault data', err);
    }
  }, [activeSubject]);

  useEffect(() => {
    loadAllData();
  }, []);

  // Save / Update Subject
  const handleSaveSubject = async (subjectData: {
    name: string;
    description: string;
    color: Subject['color'];
    icon: string;
  }) => {
    if (editSubject) {
      await updateSubject(editSubject.id, subjectData);
      showToast(`Subject "${subjectData.name}" updated successfully.`);
    } else {
      await createSubject(subjectData);
      showToast(`Subject "${subjectData.name}" created!`, 'success');
    }
    await loadAllData();
    setEditSubject(null);
  };

  // Delete Subject
  const handleDeleteSubjectClick = (subject: Subject) => {
    setDeleteModal({
      isOpen: true,
      itemType: 'Subject',
      title: `Delete "${subject.name}"?`,
      description:
        'This will permanently delete this subject vault along with all associated question papers, files, and notes.',
      onConfirm: async () => {
        await deleteSubject(subject.id);
        if (activeSubject?.id === subject.id) {
          setActiveSubject(null);
        }
        await loadAllData();
        showToast(`Subject "${subject.name}" deleted.`);
      },
    });
  };

  // Upload File
  const handleUploadFile = async (file: File, category: FileCategory) => {
    if (!activeSubject) return;
    try {
      const newFile = await uploadStudyFile(file, activeSubject.id, category);
      await loadAllData();
      showToast(`Uploaded "${file.name}" to ${category}.`);
    } catch (err) {
      showToast(`Failed to upload ${file.name}`, 'error');
    }
  };

  // Delete File
  const handleDeleteFileClick = (file: StudyFile) => {
    setDeleteModal({
      isOpen: true,
      itemType: 'File',
      title: `Delete "${file.name}"?`,
      description: 'Are you sure you want to remove this file from your vault?',
      onConfirm: async () => {
        await deleteStudyFile(file.id, file.file_path);
        await loadAllData();
        showToast(`File "${file.name}" deleted.`);
      },
    });
  };

  // Save / Update Note
  const handleSaveNote = async (noteData: {
    subject_id: string;
    title: string;
    content: string;
    category: FileCategory;
    tags: string[];
    is_pinned: boolean;
  }) => {
    if (editNote) {
      await updateStudyNote(editNote.id, noteData);
      showToast(`Note "${noteData.title}" updated.`);
    } else {
      await createStudyNote(noteData);
      showToast(`Note "${noteData.title}" saved!`);
    }
    await loadAllData();
    setEditNote(null);
  };

  // Delete Note
  const handleDeleteNoteClick = (note: StudyNote) => {
    setDeleteModal({
      isOpen: true,
      itemType: 'Note',
      title: `Delete "${note.title}"?`,
      description: 'Are you sure you want to delete this study note?',
      onConfirm: async () => {
        await deleteStudyNote(note.id);
        await loadAllData();
        showToast(`Note "${note.title}" deleted.`);
      },
    });
  };

  // Supabase Config Save
  const handleSaveSupabaseConfig = (url: string, anonKey: string, isConnected: boolean) => {
    const updated = saveConfig({ url, anonKey, isConnected });
    setSupabaseConfig(updated);
    loadAllData();
    showToast(
      isConnected
        ? 'Connected to live Supabase project!'
        : 'Switched to local storage demo mode.',
      'info'
    );
  };

  // Restore sample demo data
  const handleResetDemoData = () => {
    resetDemoData();
    loadAllData();
    showToast('Restored rich sample subjects and question papers.', 'info');
  };

  // Quick upload handler from subject grid card menu
  const handleQuickUpload = (subject: Subject) => {
    setActiveSubject(subject);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Particle Canvas Background */}
      <ParticleBackground />

      {/* Fixed Navigation Bar */}
      <Navbar
        stats={stats}
        supabaseConfig={supabaseConfig}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddSubject={() => {
          setEditSubject(null);
          setIsAddSubjectOpen(true);
        }}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenAddNote={() => {
          setEditNote(null);
          setDefaultNoteCategory('Notes');
          setIsNoteEditorOpen(true);
        }}
        activeView={activeSubject ? 'subject' : 'dashboard'}
        onNavigateHome={() => {
          setActiveSubject(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 relative z-10">
        {!activeSubject ? (
          <>
            {/* Hero Section */}
            <HeroSection
              stats={stats}
              onOpenAddSubject={() => {
                setEditSubject(null);
                setIsAddSubjectOpen(true);
              }}
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
              onScrollToSubjects={() => {
                const el = document.getElementById('subjects-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Subjects Grid */}
            <SubjectGrid
              subjects={subjects}
              onSelectSubject={(subject) => {
                setActiveSubject(subject);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAddSubject={() => {
                setEditSubject(null);
                setIsAddSubjectOpen(true);
              }}
              onEditSubject={(subject) => {
                setEditSubject(subject);
                setIsAddSubjectOpen(true);
              }}
              onDeleteSubject={handleDeleteSubjectClick}
              onQuickUpload={handleQuickUpload}
            />
          </>
        ) : (
          /* Active Subject Detail View */
          <SubjectDetailView
            subject={activeSubject}
            files={files}
            notes={notes}
            onBack={() => {
              setActiveSubject(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFileClick}
            onDeleteNote={handleDeleteNoteClick}
            onEditNote={(note) => {
              setEditNote(note);
              setIsNoteEditorOpen(true);
            }}
            onOpenAddNote={(category) => {
              setEditNote(null);
              setDefaultNoteCategory(category || 'Notes');
              setIsNoteEditorOpen(true);
            }}
            onPreviewFile={(file) => setPreviewFile(file)}
            onPreviewNote={(note) => setPreviewNote(note)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        stats={stats}
        supabaseConfig={supabaseConfig}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Modals */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => {
          setIsAddSubjectOpen(false);
          setEditSubject(null);
        }}
        onSaveSubject={handleSaveSubject}
        editSubject={editSubject}
      />

      <NoteEditorModal
        isOpen={isNoteEditorOpen}
        onClose={() => {
          setIsNoteEditorOpen(false);
          setEditNote(null);
        }}
        subjects={subjects}
        defaultSubjectId={activeSubject?.id}
        defaultCategory={defaultNoteCategory}
        editNote={editNote}
        onSaveNote={handleSaveNote}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSubject={(sub) => {
          setActiveSubject(sub);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectFile={(f) => {
          const sub = subjects.find((s) => s.id === f.subject_id);
          if (sub) setActiveSubject(sub);
          setPreviewFile(f);
        }}
        onSelectNote={(n) => {
          const sub = subjects.find((s) => s.id === n.subject_id);
          if (sub) setActiveSubject(sub);
          setPreviewNote(n);
        }}
      />

      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        config={supabaseConfig}
        onSaveConfig={handleSaveSupabaseConfig}
        onResetDemoData={handleResetDemoData}
      />

      <FilePreviewModal
        file={previewFile}
        note={previewNote}
        onClose={() => {
          setPreviewFile(null);
          setPreviewNote(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        description={deleteModal.description}
        itemType={deleteModal.itemType}
        onConfirm={deleteModal.onConfirm}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
                : toastMessage.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-500/40 shadow-red-950/50'
                : 'bg-violet-950/90 text-violet-200 border-violet-500/40 shadow-violet-950/50'
            }`}
          >
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
