import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Note, useNoteStore } from '~/store/useNoteStore';
import { useAuthStore } from '~/store/simpleAuthStore';
import { useToast } from './ToastProvider';

interface NoteCardProps {
  note: Note;
}

function timeAgo(timestamp: bigint): string {
  try {
    const now = new Date();
    // Convert nanoseconds to milliseconds with proper BigInt handling
    const noteDate = new Date(Number(timestamp / BigInt(1000000)));
    const seconds = Math.round((now.getTime() - noteDate.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Recently';
  }
}


const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteNote } = useNoteStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const shareableLink = `${window.location.origin}/note/${note.id.toString()}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      addToast('Link copied to clipboard!', 'success', 3000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      addToast('Failed to copy link', 'error', 3000);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${note.id.toString()}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteNote(note.id);
      if (success) {
        addToast('Note deleted successfully!', 'success', 3000);
        setShowDeleteConfirm(false);
      } else {
        addToast('Failed to delete note. Please try again.', 'error', 5000);
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      addToast('Failed to delete note. Please try again.', 'error', 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Handle both createdAt and created_at property names
  const timestamp = note.createdAt || (note as any).created_at || BigInt(Date.now() * 1000000);

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-5 transform transition-all hover:scale-105 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-primary mb-2 truncate" title={note.title}>
          {note.title}
        </h3>
        <p className="text-text-secondary text-sm mb-4 h-20 overflow-hidden text-ellipsis">
          {note.content}
        </p>
      </div>
      <div className="mt-auto">
        <p className="text-xs text-gray-400 mb-3">Created: {timeAgo(timestamp)}</p>

        {showDeleteConfirm ? (
          <div className="space-y-2">
            <p className="text-sm text-red-400 text-center">Delete this note?</p>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="flex-1 text-xs bg-gray-600 hover:bg-gray-700 text-white py-2 px-2 rounded transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded transition duration-150 ease-in-out flex items-center justify-center"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Link
                to={`/note/${note.id.toString()}`}
                className="flex-1 text-xs bg-primary hover:bg-secondary text-white py-2 px-2 rounded transition duration-150 ease-in-out text-center"
              >
                View
              </Link>
              <button
                onClick={handleCopyLink}
                title="Copy shareable link"
                className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded transition duration-150 ease-in-out"
              >
                Share
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="flex-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-2 rounded transition duration-150 ease-in-out"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
