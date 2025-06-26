import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Note as CanisterNote } from 'declarations/note_canister/note_canister.did';
import { Actor, ActorSubclass } from '@dfinity/agent';
// Placeholder for the service type, replace with actual generated type
type NoteCanisterService = any;

// Frontend representation of a Note
interface Note {
  id: bigint;
  title: string;
  content: string;
  createdAt: bigint; // nanoseconds
  owner: string; // Principal as text
}

// Determine canister ID and host based on environment
const CANISTER_ID_NOTE_CANISTER = process.env.CANISTER_ID_NOTE_CANISTER || process.env.NOTE_CANISTER_CANISTER_ID;
const HOST = process.env.DFX_NETWORK === 'ic'
  ? `https://${CANISTER_ID_NOTE_CANISTER}.icp0.io`
  : 'http://127.0.0.1:4943';

const NoteView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actor, setActor] = useState<ActorSubclass<NoteCanisterService> | null>(null);

  useEffect(() => {
    // Create a public actor (no identity needed for public calls)
    // Dynamically import the service definition (declarations)
    if (CANISTER_ID_NOTE_CANISTER) {
      import(`declarations/note_canister`)
        .then(module => {
          if (!module || !module.idlFactory) {
            console.error('Failed to load idlFactory from declarations/note_canister for NoteView');
            setError('Error loading canister details.');
            setIsLoading(false);
            return;
          }
          const publicActor = Actor.createActor<NoteCanisterService>(module.idlFactory, {
            agentOptions: { host: HOST },
            canisterId: CANISTER_ID_NOTE_CANISTER,
          });
          setActor(publicActor);
        })
        .catch(err => {
          console.error("Error creating public actor for NoteView:", err);
          setError('Error initializing canister connection.');
          setIsLoading(false);
        });
    } else {
        setError('Canister ID not found for notes.');
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id || !actor) {
      if (id && !actor && !isLoading && !error) { // actor might still be loading
          // setError("Note actor not available."); // Avoid setting error if actor is just loading
      } else if(!id) {
          setError("Note ID is missing.");
          setIsLoading(false);
      }
      return;
    }

    const fetchNote = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const noteId = BigInt(id);
        // Using optional chaining for actor and direct call
        const result: any = await actor.get_note_by_id(noteId); // result is Option<Note>

        if (result && result.length > 0) { // Candid Option<T> is represented as Vec<T> (empty if None, one element if Some)
          const fetchedNote = result[0];
          setNote({
            id: BigInt(fetchedNote.id),
            title: fetchedNote.title,
            content: fetchedNote.content,
            createdAt: BigInt(fetchedNote.created_at),
            owner: fetchedNote.owner.toText(),
          });
        } else {
          setNote(null); // Note not found
          setError("Note not found or you don't have permission to view it.");
        }
      } catch (err: any) {
        console.error('Failed to fetch note:', err);
        setError(err.message || 'An error occurred while fetching the note.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, actor, isLoading, error]); // Added isLoading and error to dependencies with care

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] animate-fade-in">
        {/* Optional: Add a more visually appealing spinner/loader here */}
        <svg className="animate-spin h-10 w-10 text-brand-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-brand-primary">Loading note...</p>
      </div>
    );
  }

  if (error && !note) { // Only show error if note is not loaded
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center animate-fade-in">
        <p className="text-xl text-status-error">{error}</p>
      </div>
    );
  }

  if (!note) { // Should be covered by error state, but as a fallback
     return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center animate-fade-in">
        <p className="text-xl text-neutral-light">Note not found.</p>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const twitterShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out this note on NoteChain: ${note.title}`)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 sm:p-10 bg-neutral-darker/60 backdrop-blur-xl border border-neutral-dark/50 rounded-2xl shadow-2xl animate-fade-in-up">
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-4 break-words leading-tight">
        {note.title || "Untitled Note"}
      </h1>
      <div className="text-xs text-neutral-medium mb-2">
        <span>Created: {new Date(Number(note.createdAt / 1000000n)).toLocaleString()}</span>
      </div>
      <div className="text-xs text-neutral-dark mb-6 truncate" title={`Owner: ${note.owner}`}>
        <span className="font-medium text-neutral-medium">Owner:</span> <span className="font-mono">{note.owner}</span>
      </div>

      {/* Using prose for basic markdown-like styling if content were richer, but for plain text it's fine.
          Alternatively, style paragraph directly. Added min-h for content area. */}
      <div className="bg-neutral-dark/70 p-6 rounded-lg shadow-inner min-h-[150px]">
        <p className="text-neutral-lightest whitespace-pre-wrap break-words text-base sm:text-lg leading-relaxed">
          {note.content || <span className="italic">This note has no content.</span>}
        </p>
      </div>

      <div className="mt-10 text-center">
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500/90 hover:to-blue-600/90 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105 text-base"
        >
          {/* <FiTwitter className="mr-2 h-5 w-5" /> Optional: Twitter Icon */}
          Share on X
        </a>
      </div>
    </div>
  );
};

export default NoteView;
