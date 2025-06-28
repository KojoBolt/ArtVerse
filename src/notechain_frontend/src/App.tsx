import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '~/components/Navbar';
import NoteList from '~/components/NoteList';
import NoteForm from '~/components/NoteForm';
import NoteView from '~/components/NoteView';
import EditNote from '~/components/EditNote';

// No authentication needed - all routes are open
const OpenRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return children;
};


const HomePage: React.FC = () => {
  // Show the note list directly - no authentication needed
  return <NoteList />;
};


function App() {
  // No initialization needed for simple auth

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/create"
            element={
              <OpenRoute>
                <NoteForm />
              </OpenRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <OpenRoute>
                <EditNote />
              </OpenRoute>
            }
          />
          <Route path="/note/:id" element={<NoteView />} /> {/* Publicly accessible */}
          {/* Fallback for any other routes or a 404 component */}
          <Route path="*" element={
            <div className="text-center text-xl mt-10 text-red-500">Page Not Found</div>
          } />
        </Routes>
      </main>
      <footer className="bg-surface text-center py-4 mt-auto">
        <p className="text-text-secondary text-sm">
          NoteChain &copy; {new Date().getFullYear()} - Decentralized & Secure.
        </p>
      </footer>
    </div>
  );
}

export default App;
