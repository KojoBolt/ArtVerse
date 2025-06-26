import React, { useState } from 'react'; // Added useState for copy feedback
import { Link } from 'react-router-dom';
import { Note } from '~/store/useNoteStore';
// Consider adding an icon library like react-icons if desired for share/view icons
// import { FiExternalLink, FiShare2, FiCopy } from 'react-icons/fi';


function timeAgo(timestamp: bigint): string {
  const now = new Date();
  const noteDate = new Date(Number(timestamp / 1000000n)); // Convert nanoseconds to milliseconds
  const seconds = Math.round((now.getTime() - noteDate.getTime()) / 1000);

  if (seconds < 5) return 'just now'; // More immediate feedback
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  // For older dates, show the actual date
  return noteDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}


const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const shareableLink = `${window.location.origin}/note/${note.id.toString()}`;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => console.error('Failed to copy link: ', err));
  };

  return (
    <div className="bg-neutral-darker/60 backdrop-blur-md border border-neutral-dark/50 rounded-xl shadow-xl hover:shadow-glow-primary transition-all duration-300 ease-in-out flex flex-col overflow-hidden transform hover:-translate-y-1 animate-fade-in-up">
      <div className="p-5 sm:p-6 flex-grow">
        <h3
          className="text-lg sm:text-xl font-semibold text-neutral-lightest mb-2 truncate transition-colors hover:text-brand-accent"
          title={note.title}
        >
          <Link to={`/note/${note.id.toString()}`}>
            {note.title || "Untitled Note"}
          </Link>
        </h3>
        <p className="text-neutral-light text-sm mb-4 h-20 overflow-hidden line-clamp-3" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
          {note.content || <span className="italic">No content...</span>}
        </p>
      </div>
      <div className="px-5 sm:px-6 py-4 bg-neutral-dark/50 border-t border-neutral-dark/70">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-medium" title={new Date(Number(note.createdAt / 1000000n)).toLocaleString()}>
            {timeAgo(note.createdAt)}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              title="Copy shareable link"
              className={`text-sm text-neutral-light hover:text-brand-accent p-2 rounded-md transition-colors duration-150 ease-in-out ${copied ? 'text-status-success' : ''}`}
            >
              {/* <FiCopy className="w-4 h-4 inline mr-1" /> For icon use */}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <Link
              to={`/note/${note.id.toString()}`}
              className="text-sm bg-brand-primary hover:opacity-90 text-neutral-lightest font-medium py-2 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 ease-in-out transform hover:scale-105"
            >
              {/* <FiExternalLink className="w-4 h-4 inline mr-1" /> For icon use */}
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

interface NoteCardProps { // Moved interface to bottom for better readability with export default
  note: Note;
}
