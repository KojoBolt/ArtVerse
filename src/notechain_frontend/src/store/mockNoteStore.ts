import { create } from "zustand";

interface Note {
  id: bigint;
  title: string;
  content: string;
  created_at: bigint;
  owner: string;
}

interface MockNoteState {
  notes: Note[];
  addNote: (title: string, content: string) => void;
  getNotes: () => Note[];
  getNoteById: (id: bigint) => Note | null;
}

// Mock notes for demo
const demoNotes: Note[] = [
  {
    id: BigInt(1),
    title: "Welcome to NoteChain!",
    content:
      "This is a demo note. NoteChain is a decentralized note-taking app built on the Internet Computer.",
    created_at: BigInt(Date.now() * 1000000),
    owner: "guest-user",
  },
  {
    id: BigInt(2),
    title: "How to use NoteChain",
    content:
      "1. Login with Anonymous Identity or try the demo\n2. Create new notes\n3. View and manage your notes\n4. Everything is stored on the blockchain!",
    created_at: BigInt(Date.now() * 1000000),
    owner: "guest-user",
  },
];

export const useMockNoteStore = create<MockNoteState>((set, get) => ({
  notes: [...demoNotes],

  addNote: (title: string, content: string) => {
    const newNote: Note = {
      id: BigInt(Date.now()),
      title,
      content,
      created_at: BigInt(Date.now() * 1000000),
      owner: "guest-user",
    };

    set((state) => ({
      notes: [...state.notes, newNote],
    }));
  },

  getNotes: () => {
    return get().notes;
  },

  getNoteById: (id: bigint) => {
    return get().notes.find((note) => note.id === id) || null;
  },
}));
