import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '~/components/Navbar';
import NoteList from '~/components/NoteList';
import NoteForm from '~/components/NoteForm';
import NoteView from '~/components/NoteView';
import { useAuthStore } from '~/store/simpleAuthStore';

// A simple protected route component
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated
  }));
  const location = useLocation();

  if (!isAuthenticated) {
    // Could redirect to a login page or show a message
    // For now, just showing a message if trying to access protected content directly.
    // Navbar will show login button.
    // If accessing /create directly, NoteForm also handles !isAuthenticated.
    if (location.pathname === "/create") {
      return <NoteForm />; // NoteForm itself handles the auth check
    }
    return (
      <div className="text-center text-xl mt-10 text-text-secondary">
        Please log in to access this page.
      </div>
    );
  }
  return children;
};


const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-6">Welcome to NoteChain!</h1>
        <p className="text-xl text-text-secondary mb-8">
          Your secure, decentralized note-taking application on the Internet Computer.
        </p>
        <p className="text-lg text-text-secondary">
          Choose "Login (Anonymous)" for blockchain features or "Try Demo" for a quick preview.
        </p>
      </div>
    );
  }
  // If authenticated, show the list of notes on the homepage
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
              <ProtectedRoute>
                <NoteForm />
              </ProtectedRoute>
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
