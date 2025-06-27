import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Actor, ActorSubclass } from '@dfinity/agent';
// Import the generated service type
import type { _SERVICE as NoteCanisterService } from '../../../../src/declarations/note_canister/note_canister.did.d.ts';

// Frontend representation of a Note (using the generated type)
interface Note {
  id: bigint;
  title: string;
  content: string;
  created_at?: bigint; // nanoseconds
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
        .then(async module => {
          if (!module || !module.idlFactory) {
            console.error('Failed to load idlFactory from declarations/note_canister for NoteView');
            setError('Error loading canister details.');
            setIsLoading(false);
            return;
          }
          const { HttpAgent } = await import('@dfinity/agent');
          const publicActor = Actor.createActor<NoteCanisterService>(module.idlFactory, {
            agent: new HttpAgent({
              host: HOST,
            }),
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
      } else if (!id) {
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
            created_at: BigInt(fetchedNote.created_at),
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
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-primary">Loading note...</p>
        {/* Spinner icon */}
      </div>
    );
  }

  if (error && !note) { // Only show error if note is not loaded
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!note) { // Should be covered by error state, but as a fallback
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center">
        <p className="text-xl text-text-secondary">Note not found.</p>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const twitterShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out this note: ${note.title}`)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-surface rounded-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-primary mb-3 break-words">{note.title}</h1>
      <p className="text-sm text-gray-400 mb-1">
        Created: {new Date(Number(note?.created_at! / 1000000n)).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-6 truncate" title={`Owner: ${note.owner}`}>
        Owner: {note.owner}
      </p>

      <div className="prose prose-invert prose-lg max-w-none bg-gray-700 p-6 rounded-md shadow">
        <p className="whitespace-pre-wrap break-words">{note.content}</p>
      </div>

      <div className="mt-8 text-center">
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 ease-in-out text-lg shadow-md hover:shadow-lg"
        >
          Share on X (Twitter)
        </a>
      </div>
    </div>
  );
};

export default NoteView;
