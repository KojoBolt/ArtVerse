import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
// Placeholder for Note type, will be refined once Candid types are generated
// import { Note as CanisterNote } from 'declarations/note_canister/note_canister.did';

// Frontend representation of a Note, might be slightly different or augmented
export interface Note {
  id: bigint; // Candid u64 maps to bigint in JS/TS
  title: string;
  content: string;
  createdAt: bigint; // Candid u64 for timestamp
  // owner: string; // Principal.toText() - maybe not needed directly in UI list if it's always "my" notes
}

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (title: string, content: string) => Promise<bigint | null>; // Returns new note ID or null on error
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    const actor = useAuthStore.getState().noteCanisterActor;
    if (!actor) {
      set({ error: 'User not authenticated or actor not available.', isLoading: false, notes: [] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      // Assuming the actor's get_notes() returns Vec<CanisterNote>
      const canisterNotes = await actor.get_notes();
      const formattedNotes: Note[] = canisterNotes.map((note: any) => ({
        // Perform any necessary transformations here if CanisterNote differs from UI Note
        // For now, assuming direct mapping or that CanisterNote structure matches `Note`
        id: BigInt(note.id), // Ensure IDs are BigInt
        title: note.title,
        content: note.content,
        createdAt: BigInt(note.created_at),
        // owner: note.owner.toText(), // If needed
      }));
      set({ notes: formattedNotes, isLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch notes:', err);
      set({ error: err.message || 'Failed to fetch notes', isLoading: false });
    }
  },

  createNote: async (title: string, content: string) => {
    const actor = useAuthStore.getState().noteCanisterActor;
    if (!actor) {
      set({ error: 'User not authenticated or actor not available.' });
      return null;
    }
    set({ isLoading: true, error: null }); // Potentially a different loading state for creation
    try {
      const result = await actor.create_note(title, content);
      if ('Ok' in result) { // dfx >= 0.14.x returns { Ok: value } or { Err: error }
        const newNoteId = BigInt(result.Ok);
        // After creating, refresh the notes list to include the new one
        await get().fetchNotes();
        set({ isLoading: false });
        return newNoteId;
      } else if ('Err' in result) { // Check for 'Err' if using dfx >= 0.14.x
        throw new Error(result.Err);
      } else {
         // Older dfx versions might return value directly or throw. This path is less likely with modern dfx.
         // If result is directly the ID (older dfx versions or different Result type)
         const newNoteId = BigInt(result); // Assuming result is the ID
         await get().fetchNotes();
         set({ isLoading: false });
         return newNoteId;
      }
    } catch (err: any) {
      console.error('Failed to create note:', err);
      // Handle specific error messages if the canister returns them in a structured way
      const errorMessage = err.message || (typeof err === 'string' ? err : 'Failed to create note');
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },
}));

// Listen to authentication changes to fetch notes when user logs in
useAuthStore.subscribe(
  (state, prevState) => {
    if (state.isAuthenticated && !prevState.isAuthenticated) {
      useNoteStore.getState().fetchNotes();
    } else if (!state.isAuthenticated && prevState.isAuthenticated) {
      // Clear notes when user logs out
      useNoteStore.setState({ notes: [], error: null });
    }
  }
);
