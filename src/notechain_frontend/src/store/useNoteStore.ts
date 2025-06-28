import { create } from "zustand";
import { persist } from "zustand/middleware";

// Frontend representation of a Note
export interface Note {
  id: string; // Use string IDs for local storage
  title: string;
  content: string;
  createdAt: number; // Use number timestamp for JavaScript
  updatedAt: number;
  userId: string; // Reference to the user who created it
}

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotes: (userId?: string) => void;
  createNote: (title: string, content: string, userId: string) => string;
  updateNote: (id: string, title: string, content: string) => boolean;
  deleteNote: (id: string) => boolean;
  clearError: () => void;
}

// Generate a unique note ID
const generateNoteId = () =>
  `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      isLoading: false,
      error: null,

      fetchNotes: (userId?: string) => {
        set({ isLoading: true, error: null });

        try {
          const { notes } = get();
          // If userId is provided, filter notes by user
          const filteredNotes = userId
            ? notes.filter((note) => note.userId === userId)
            : notes;

          set({
            notes: filteredNotes,
            isLoading: false,
          });

          console.log(`✅ Fetched ${filteredNotes.length} notes`);
        } catch (error) {
          set({
            error: "Failed to fetch notes",
            isLoading: false,
          });
          console.error("❌ Failed to fetch notes:", error);
        }
      },

      createNote: (title: string, content: string, userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const noteId = generateNoteId();
          const now = Date.now();

          const newNote: Note = {
            id: noteId,
            title: title.trim() || "Untitled Note",
            content: content.trim(),
            createdAt: now,
            updatedAt: now,
            userId,
          };

          const { notes } = get();
          const updatedNotes = [...notes, newNote];

          set({
            notes: updatedNotes,
            isLoading: false,
          });

          console.log("✅ Note created:", noteId);
          return noteId;
        } catch (error) {
          set({
            error: "Failed to create note",
            isLoading: false,
          });
          console.error("❌ Failed to create note:", error);
          return "";
        }
      },

      updateNote: (id: string, title: string, content: string) => {
        set({ isLoading: true, error: null });

        try {
          const { notes } = get();
          const noteIndex = notes.findIndex((note) => note.id === id);

          if (noteIndex === -1) {
            set({
              error: "Note not found",
              isLoading: false,
            });
            return false;
          }

          const updatedNotes = [...notes];
          updatedNotes[noteIndex] = {
            ...updatedNotes[noteIndex],
            title: title.trim() || "Untitled Note",
            content: content.trim(),
            updatedAt: Date.now(),
          };

          set({
            notes: updatedNotes,
            isLoading: false,
          });

          console.log("✅ Note updated:", id);
          return true;
        } catch (error) {
          set({
            error: "Failed to update note",
            isLoading: false,
          });
          console.error("❌ Failed to update note:", error);
          return false;
        }
      },

      deleteNote: (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const { notes } = get();
          const updatedNotes = notes.filter((note) => note.id !== id);

          set({
            notes: updatedNotes,
            isLoading: false,
          });

          console.log("✅ Note deleted:", id);
          return true;
        } catch (error) {
          set({
            error: "Failed to delete note",
            isLoading: false,
          });
          console.error("❌ Failed to delete note:", error);
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "artverse-notes", // localStorage key
      partialize: (state) => ({ notes: state.notes }), // Only persist notes
    }
  )
);
