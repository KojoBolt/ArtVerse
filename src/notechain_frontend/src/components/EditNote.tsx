import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoteStore } from '~/store/useNoteStore';
import { useAuthStore } from '~/store/simpleAuthStore';
import { useToast } from './ToastProvider';

const NOTE_TITLE_MAX_LENGTH = 100;
const NOTE_CONTENT_MAX_LENGTH = 924;

const EditNote: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { notes, updateNote } = useNoteStore();
    const { user } = useAuthStore(); // Only need user, no auth check needed
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError('Invalid note ID');
            setIsLoading(false);
            return;
        }

        // Find the note to edit
        const noteToEdit = notes.find(note => note.id.toString() === id);
        if (noteToEdit) {
            setTitle(noteToEdit.title);
            setContent(noteToEdit.content);
            setIsLoading(false);
        } else {
            setError('Note not found');
            setIsLoading(false);
        }
    }, [id, notes, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

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
        try {
            const success = await updateNote(id!, title, content);
            setIsSubmitting(false);

            if (success) {
                addToast("Note updated successfully!", 'success', 4000);

                // Navigate back immediately
                navigate('/');
            } else {
                setError("Failed to update note. Please try again.");
            }
        } catch (err: any) {
            setIsSubmitting(false);
            setError(err.message || "An unexpected error occurred.");
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-surface rounded-lg shadow-xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading note...</p>
                </div>
            </div>
        );
    }

    if (error && !title && !content) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-surface rounded-lg shadow-xl">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                    <p className="text-text-secondary mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
                    >
                        Back to Notes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-surface rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">Edit Note</h2>
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
                        placeholder="Enter note content"
                        rows={8}
                        className="w-full p-3 bg-gray-700 text-text-primary rounded-md border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Total length (title + content): {title.length + content.length} / 1024 bytes.
                    </p>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : "Update Note"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditNote;
