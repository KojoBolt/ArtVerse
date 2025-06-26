import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore } from '~/store/useNoteStore';
import { useAuthStore } from '~/store/useAuthStore';

const NOTE_TITLE_MAX_LENGTH = 100; // Arbitrary limit, can adjust
const NOTE_CONTENT_MAX_LENGTH = 924; // 1024 - title_max_length approx

const NoteForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createNote = useNoteStore((state) => state.createNote);
  const storeError = useNoteStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError("You must be logged in to create a note.");
      return;
    }
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }
    if (title.length + content.length > 1024) {
      setError("Total length of title and content cannot exceed 1024 bytes.");
      return;
    }

    setIsSubmitting(true);
    const newNoteId = await createNote(title, content);
    setIsSubmitting(false);

    if (newNoteId) {
      setTitle('');
      setContent('');
      navigate('/'); // Navigate to home/dashboard after creation
    } else {
      // Error is already set in the store, or use a local error
      setError(storeError || "Failed to create note. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-surface rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center">Create New Note</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
            Title <span className="text-red-500">*</span> ({title.length}/{NOTE_TITLE_MAX_LENGTH})
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, NOTE_TITLE_MAX_LENGTH))}
            placeholder="Enter note title"
            className="w-full p-3 bg-gray-700 text-text-primary rounded-md border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-text-secondary mb-1">
            Content <span className="text-red-500">*</span> ({content.length}/{NOTE_CONTENT_MAX_LENGTH})
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, NOTE_CONTENT_MAX_LENGTH))}
            placeholder="Enter note content (max 1KB total with title)"
            rows={8}
            className="w-full p-3 bg-gray-700 text-text-primary rounded-md border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Total length (title + content): {title.length + content.length} / 1024 bytes.
          </p>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {storeError && !error && <p className="text-red-500 text-sm text-center">{storeError}</p>}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isAuthenticated}
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
