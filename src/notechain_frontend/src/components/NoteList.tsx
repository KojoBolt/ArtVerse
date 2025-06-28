import React, { useEffect, useState, useMemo } from 'react';
import { useNoteStore } from '~/store/useNoteStore';
import { useAuthStore } from '~/store/simpleAuthStore';
import NoteCard from './NoteCard';
import { Link } from 'react-router-dom';

const NoteList: React.FC = () => {
  const { notes, isLoading, error, fetchNotes } = useNoteStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notes based on search term
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;

    const lowercaseSearch = searchTerm.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowercaseSearch) ||
      note.content.toLowerCase().includes(lowercaseSearch)
    );
  }, [notes, searchTerm]);

  useEffect(() => {
    if (user) {
      fetchNotes(user.id); // Fetch notes for current user
    }
  }, [user, fetchNotes]);

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <div className="max-w-md mx-auto p-6 bg-surface rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-primary">Loading your notes...</p>
          <p className="text-sm text-text-secondary mt-2">
            Fetching your notes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <div className="max-w-md mx-auto p-6 bg-surface rounded-lg shadow-xl">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-red-500 mb-2">Failed to load notes</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => fetchNotes(user?.id)}
            className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center mt-10">
        <div className="max-w-2xl mx-auto p-6 bg-surface rounded-lg shadow-xl">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">No notes yet</h3>
          <p className="text-text-secondary mb-6">
            Start building your note collection. Create your first note to get started!
          </p>
          <Link
            to="/create"
            className="inline-block bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition duration-150 ease-in-out"
          >
            Create Your First Note
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-primary">My Notes</h2>
          <p className="text-text-secondary mt-1">
            {filteredNotes.length} of {notes.length} notes {searchTerm ? '(filtered)' : ''}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-3 pl-10 bg-gray-700 text-text-primary rounded-lg border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-white"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <Link
            to="/create"
            className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition duration-150 ease-in-out text-center whitespace-nowrap"
          >
            + New Note
          </Link>
        </div>
      </div>

      {searchTerm && filteredNotes.length === 0 && notes.length > 0 && (
        <div className="text-center py-8">
          <div className="max-w-md mx-auto p-6 bg-surface rounded-lg shadow-xl">
            <svg className="mx-auto h-12 w-12 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-text-primary mb-2">No notes found</h3>
            <p className="text-text-secondary mb-4">
              No notes match your search for "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id.toString()} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
