import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '~/store/useNoteStore'; // Assuming Note type is exported from store

interface NoteCardProps {
  note: Note;
}

function timeAgo(timestamp: bigint): string {
  const now = new Date();
  const noteDate = new Date(Number(timestamp / 1000000n)); // Convert nanoseconds to milliseconds
  const seconds = Math.round((now.getTime() - noteDate.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}


const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const shareableLink = `${window.location.origin}/note/${note.id.toString()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link: ', err));
  };

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
        <p className="text-xs text-gray-400 mb-3">Created: {timeAgo(note.createdAt)}</p>
        <div className="flex items-center justify-between space-x-2">
          <Link
            to={`/note/${note.id.toString()}`}
            className="text-sm bg-primary hover:bg-secondary text-white py-2 px-3 rounded-md transition duration-150 ease-in-out text-center flex-grow"
          >
            View
          </Link>
          <button
            onClick={handleCopyLink}
            title="Copy shareable link"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition duration-150 ease-in-out text-center"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
