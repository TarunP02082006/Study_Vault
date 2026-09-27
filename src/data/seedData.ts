import { Subject, StudyFile, StudyNote } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Distributed Systems & Cloud',
    description: 'Consensus algorithms (Raft, Paxos), CAP theorem, microservices resilience, and fault-tolerant architecture.',
    color: 'violet',
    icon: 'Server',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'sub-2',
    name: 'Machine Learning & Deep Neural Nets',
    description: 'Loss functions, backpropagation, Transformer architectures, attention mechanisms, and fine-tuning pipelines.',
    color: 'pink',
    icon: 'Brain',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'sub-3',
    name: 'Data Structures & Algorithms',
    description: 'Dynamic programming, balanced trees (AVL, Red-Black), graph traversals, and amortized complexity analysis.',
    color: 'cyan',
    icon: 'Code2',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'sub-4',
    name: 'UI/UX Design & Human-Computer Interaction',
    description: 'Fitts’ Law, design systems, visual hierarchy, cognitive load reduction, and micro-interaction ergonomics.',
    color: 'amber',
    icon: 'Palette',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: 'sub-5',
    name: 'Discrete Mathematics & Graph Theory',
    description: 'Combinatorics, boolean algebra, planar graphs, Eulerian tours, and recurrence relations.',
    color: 'emerald',
    icon: 'Calculator',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'sub-6',
    name: 'Database Internals & Storage Engines',
    description: 'B+ Tree indexing, Write-Ahead Logging (WAL), MVCC concurrency control, and query optimization.',
    color: 'orange',
    icon: 'Database',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  }
];

export const INITIAL_FILES: StudyFile[] = [
  // Distributed Systems
  {
    id: 'file-101',
    subject_id: 'sub-1',
    name: 'MidTerm_Exam_Distributed_2025_With_Solutions.pdf',
    category: 'Question Papers',
    file_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    file_path: 'sub-1/Question Papers/MidTerm_Exam_Distributed_2025_With_Solutions.pdf',
    mime_type: 'application/pdf',
    size_text: '2.4 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    is_demo: true
  },
  {
    id: 'file-102',
    subject_id: 'sub-1',
    name: 'Fall2024_Final_Exam_Raft_Paxos_Consensus.pdf',
    category: 'Question Papers',
    file_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    file_path: 'sub-1/Question Papers/Fall2024_Final_Exam_Raft_Paxos_Consensus.pdf',
    mime_type: 'application/pdf',
    size_text: '1.8 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    is_demo: true
  },
  {
    id: 'file-103',
    subject_id: 'sub-1',
    name: 'Architecture_Consensus_State_Machine_Diagram.png',
    category: 'Notes',
    file_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    file_path: 'sub-1/Notes/Architecture_Consensus_State_Machine_Diagram.png',
    mime_type: 'image/png',
    size_text: '940 KB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    is_demo: true
  },
  {
    id: 'file-104',
    subject_id: 'sub-1',
    name: 'MiniProject_Distributed_KV_Store_Go.zip',
    category: 'Mini Projects',
    file_url: '#',
    file_path: 'sub-1/Mini Projects/MiniProject_Distributed_KV_Store_Go.zip',
    mime_type: 'application/zip',
    size_text: '4.7 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    is_demo: true
  },

  // Machine Learning
  {
    id: 'file-201',
    subject_id: 'sub-2',
    name: 'Transformer_Attention_Mechanisms_Formula_Sheet.pdf',
    category: 'Notes',
    file_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    file_path: 'sub-2/Notes/Transformer_Attention_Mechanisms_Formula_Sheet.pdf',
    mime_type: 'application/pdf',
    size_text: '3.1 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    is_demo: true
  },
  {
    id: 'file-202',
    subject_id: 'sub-2',
    name: 'PyTorch_VisionTransformer_Notebook_Project.ipynb',
    category: 'Mini Projects',
    file_url: '#',
    file_path: 'sub-2/Mini Projects/PyTorch_VisionTransformer_Notebook_Project.ipynb',
    mime_type: 'application/json',
    size_text: '1.2 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    is_demo: true
  },
  {
    id: 'file-203',
    subject_id: 'sub-2',
    name: 'Deep_Learning_Spring_Midterm_Paper.pdf',
    category: 'Question Papers',
    file_url: '#',
    file_path: 'sub-2/Question Papers/Deep_Learning_Spring_Midterm_Paper.pdf',
    mime_type: 'application/pdf',
    size_text: '1.5 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    is_demo: true
  },

  // DSA
  {
    id: 'file-301',
    subject_id: 'sub-3',
    name: 'DSA_Competitive_Programming_CheatSheet.pdf',
    category: 'Notes',
    file_url: '#',
    file_path: 'sub-3/Notes/DSA_Competitive_Programming_CheatSheet.pdf',
    mime_type: 'application/pdf',
    size_text: '4.2 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    is_demo: true
  },
  {
    id: 'file-302',
    subject_id: 'sub-3',
    name: 'End_Sem_Advanced_Algorithms_2024.pdf',
    category: 'Question Papers',
    file_url: '#',
    file_path: 'sub-3/Question Papers/End_Sem_Advanced_Algorithms_2024.pdf',
    mime_type: 'application/pdf',
    size_text: '2.1 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    is_demo: true
  },

  // UI/UX Design
  {
    id: 'file-401',
    subject_id: 'sub-4',
    name: 'Design_System_Figma_Component_Spec.png',
    category: 'Notes',
    file_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    file_path: 'sub-4/Notes/Design_System_Figma_Component_Spec.png',
    mime_type: 'image/png',
    size_text: '1.6 MB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    is_demo: true
  },
  {
    id: 'file-402',
    subject_id: 'sub-4',
    name: 'Design_Critique_Evaluation_Assignment.pdf',
    category: 'Question Papers',
    file_url: '#',
    file_path: 'sub-4/Question Papers/Design_Critique_Evaluation_Assignment.pdf',
    mime_type: 'application/pdf',
    size_text: '880 KB',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    is_demo: true
  }
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    subject_id: 'sub-1',
    title: 'Raft Consensus vs Paxos: Invariant Comparison',
    content: `### Raft Protocol Key Properties:
1. **Leader Election:** Randomized election timeouts (150ms - 300ms) to prevent split votes.
2. **Log Replication:** AppendEntries RPCs enforce leader completeness invariant.
3. **Safety Guarantee:** If a leader commits an entry at index $i$, no subsequent leader can commit a different entry at $i$.

### Paxos Comparison:
- Raft decomposes problem into: Leader Election, Log Replication, and Safety.
- Multi-Paxos optimizes Phase 1 (Prepare/Promise) by maintaining stable proposer.
- In practice, Raft is significantly easier to implement without edge-case race conditions.`,
    category: 'Notes',
    tags: ['Consensus', 'Raft', 'Distributed-Systems', 'Exam-Essential'],
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'note-2',
    subject_id: 'sub-1',
    title: 'CAP Theorem & PACELC Nuances for System Design',
    content: `**CAP Theorem Invariants:**
- In the presence of a Network Partition (P), choose between Consistency (C) or Availability (A).
- **PACELC Extension:** If Partition (P), trade Consistency (C) vs Availability (A); ELSE (E), trade Latency (L) vs Consistency (C).

*Examples:*
- DynamoDB / Cassandra: PA/EL (favors availability & low latency)
- Spanner / CockroachDB: PC/EC (strictly serializable consistency via TrueTime & Multi-Paxos)`,
    category: 'Notes',
    tags: ['System-Design', 'CAP-Theorem', 'Storage'],
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'note-3',
    subject_id: 'sub-2',
    title: 'Scaled Dot-Product Attention & Multi-Head Projections',
    content: `### Equation:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

### Multi-Head Dimensions:
- $d_{model} = 768$ (base) or $1024$ (large)
- Number of heads $h = 12$
- $d_k = d_v = d_{model} / h = 64$
- The scaling factor $1/\\sqrt{d_k}$ prevents the dot products from growing excessively large for large dimensions, which would push softmax into regions with vanishing gradients!`,
    category: 'Notes',
    tags: ['Transformers', 'Attention', 'Math', 'Deep-Learning'],
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'note-4',
    subject_id: 'sub-3',
    title: 'Red-Black Tree Invariants & Rebalancing Rotations',
    content: `### The 5 Red-Black Tree Rules:
1. Every node is either Red or Black.
2. Root is always Black.
3. Every leaf (NIL) is Black.
4. If a node is Red, both children MUST be Black (no consecutive red nodes).
5. For each node, all simple paths to descendant leaves contain the SAME number of black nodes (Black-Height).

**Time Complexity:**
- Search: $O(\\log n)$
- Insert: $O(\\log n)$ with $\\le 2$ rotations
- Delete: $O(\\log n)$ with $\\le 3$ rotations`,
    category: 'Notes',
    tags: ['Data-Structures', 'Trees', 'Algorithms'],
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'note-5',
    subject_id: 'sub-4',
    title: 'Fitts’ Law & Touch Target Ergonomics',
    content: `**Fitts' Law Formula:**
$$T = a + b \\log_2\\left(1 + \\frac{D}{W}\\right)$$
Where:
- $T$ = time to acquire target
- $D$ = distance to target
- $W$ = width of target

**Design Guidelines:**
1. Screen edges and corners have infinite virtual width ($W$).
2. Bottom navigation bar is easiest for one-handed mobile thumbs.
3. Minimum touch target size: 44px x 44px (Apple HIG) / 48px x 48px (Material Design).`,
    category: 'Notes',
    tags: ['HCI', 'UX-Laws', 'Ergonomics'],
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'note-6',
    subject_id: 'sub-6',
    title: 'B+ Tree Page Splitting & WAL ARIES Protocol',
    content: `### Write-Ahead Logging (WAL) Rules:
- **Rule 1:** Any log record describing a change must reach persistent disk BEFORE the corresponding dirty page is flushed from buffer pool to disk.
- **Rule 2:** Transaction commit log record must be flushed to disk before the commit call completes.

### ARIES Recovery Phases:
1. **Analysis:** Scan forward from last checkpoint to reconstruct Dirty Page Table and Transaction Table.
2. **Redo:** Scan forward from smallest RecLSN to restore database to exact state before crash.
3. **Undo:** Scan backward to rollback actions of uncommitted active transactions using Compensation Log Records (CLRs).`,
    category: 'Notes',
    tags: ['Databases', 'WAL', 'Recovery', 'B-Tree'],
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  }
];

export const SUPABASE_SETUP_SQL = `-- ==========================================
-- STUDYVAULT COMPLETE DATABASE SCHEMA & POLICIES
-- Copy and paste this directly into Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'violet',
  icon TEXT DEFAULT 'Book',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Files table
CREATE TABLE IF NOT EXISTS public.files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Question Papers', 'Notes', 'Mini Projects')),
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  size_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Question Papers', 'Notes', 'Mini Projects')),
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 5. Open Access Policies (Personal study portal)
DROP POLICY IF EXISTS "Public Full Access on subjects" ON public.subjects;
CREATE POLICY "Public Full Access on subjects" ON public.subjects
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access on files" ON public.files;
CREATE POLICY "Public Full Access on files" ON public.files
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access on notes" ON public.notes;
CREATE POLICY "Public Full Access on notes" ON public.notes
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Storage Bucket Setup (Bucket Name: study-files)
-- In Supabase Dashboard -> Storage:
-- 1. Click "New Bucket"
-- 2. Name it "study-files"
-- 3. Check "Public bucket" (enabled)
-- 4. Set Allowed MIME types to: * or application/pdf, image/*, text/*, application/zip
-- 5. Save bucket
`;
