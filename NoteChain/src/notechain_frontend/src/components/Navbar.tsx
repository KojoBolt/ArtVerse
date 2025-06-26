import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '~/store/useAuthStore';

const Navbar: React.FC = () => {
  const { isAuthenticated, principal, login, logout } = useAuthStore();

  return (
    <nav className="bg-surface shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary hover:text-secondary">
          NoteChain
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Link to="/create" className="text-text-secondary hover:text-primary">
              Create Note
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <span className="text-text-secondary text-sm truncate max-w-[150px] md:max-w-xs" title={principal!}>
                {principal}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Login with Internet Identity
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
