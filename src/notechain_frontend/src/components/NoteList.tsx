import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/simpleAuthStore';
import { useMockNoteStore } from '../store/mockNoteStore';
import NoteCard from './NoteCard';
import { Link } from 'react-router-dom';

const NoteList: React.FC = () => {
  const { isAuthenticated, userType, noteCanisterActor } = useAuthStore();
  const { notes: mockNotes, getNotes: getMockNotes } = useMockNoteStore();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        if (userType === 'guest') {
          // Use mock data for guest users
          setNotes(getMockNotes());
        } else if (noteCanisterActor) {
          // Use real blockchain data for authenticated users
          const result = await noteCanisterActor.get_notes();
          setNotes(result);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes');
        // Fallback to mock data if blockchain fails
        setNotes(getMockNotes());
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [isAuthenticated, userType, noteCanisterActor, getMockNotes]);

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
