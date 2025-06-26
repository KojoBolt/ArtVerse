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
  const storeError = useNoteStore((state) => state.error); // Get the error from the store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear local error

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
      // Error from the store will be used if `createNote` sets it.
      // If `createNote` doesn't set an error but returns null, use a generic local error.
      // The storeError is reactive, so if it's set, it will be displayed by the component.
      // If no storeError and newNoteId is null, then set a local error.
      if (!useNoteStore.getState().error) { // Check current store error non-reactively
        setError("Failed to create note. Please try again.");
      }
    }
  };

  const currentStoreError = useNoteStore(state => state.error); // Reactive selector for store error

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 sm:p-8 bg-neutral-darker/50 backdrop-blur-md rounded-xl shadow-2xl border border-neutral-dark/50 animate-fade-in">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-8 text-center">
        Create New Note
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-light mb-1">
            Title <span className="text-status-error">*</span>
            <span className="text-xs text-neutral-medium"> ({title.length}/{NOTE_TITLE_MAX_LENGTH})</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, NOTE_TITLE_MAX_LENGTH))}
            placeholder="Enter note title"
            className="w-full p-3 bg-neutral-dark border border-neutral-dark/70 text-neutral-lightest rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent transition placeholder-neutral-medium shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-neutral-light mb-1">
            Content <span className="text-status-error">*</span>
            <span className="text-xs text-neutral-medium"> ({content.length}/{NOTE_CONTENT_MAX_LENGTH})</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, NOTE_CONTENT_MAX_LENGTH))}
            placeholder="What's on your mind? (Max 1KB total with title)"
            rows={8}
            className="w-full p-3 bg-neutral-dark border border-neutral-dark/70 text-neutral-lightest rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent transition placeholder-neutral-medium shadow-sm"
            required
          />
          <p className="text-xs text-neutral-medium mt-1 text-right">
            Total: {title.length + content.length} / 1024 bytes
          </p>
        </div>

        {/* Display local error first, then store error if no local error */}
        {error && <p className="text-status-error text-sm text-center animate-fade-in">{error}</p>}
        {!error && currentStoreError && <p className="text-status-error text-sm text-center animate-fade-in">{currentStoreError}</p>}

        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isAuthenticated}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-neutral-lightest font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-darkest focus:ring-brand-accent transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
