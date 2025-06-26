import React, { useEffect } from 'react';
import { useNoteStore } from '~/store/useNoteStore';
import { useAuthStore } from '~/store/useAuthStore';
import NoteCard from './NoteCard';
import { Link } from 'react-router-dom';

const NoteList: React.FC = () => {
  const { notes, isLoading, error, fetchNotes } = useNoteStore();
  const { isAuthenticated, noteCanisterActor } = useAuthStore();

  useEffect(() => {
    // Fetch notes if authenticated and actor is available
    // The store itself also triggers fetchNotes on auth change,
    // but this ensures it happens if the component mounts after auth.
    if (isAuthenticated && noteCanisterActor) {
      fetchNotes();
    }
  }, [isAuthenticated, fetchNotes, noteCanisterActor]);

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-text-secondary">Please log in to see your notes.</p>
      </div>
    );
  }

  if (isLoading && notes.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-primary">Loading your awesome notes...</p>
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-text-secondary">You haven't created any notes yet.</p>
        <Link
          to="/create"
          className="mt-4 inline-block bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Create Your First Note
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">My Notes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.map((note) => (
          <NoteCard key={note.id.toString()} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
