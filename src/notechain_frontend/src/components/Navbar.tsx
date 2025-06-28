import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/simpleAuthStore';

const Navbar: React.FC = () => {
  const { isAuthenticated, userType, principal, login, loginAsGuest, logout } = useAuthStore();

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
              <span className="text-text-secondary text-sm">
                {userType === 'guest' ? 'Guest User' : `${principal?.slice(0, 8)}...`}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-x-2">
              <button
                onClick={login}
                className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Login (Anonymous)
              </button>
              <button
                onClick={loginAsGuest}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Try Demo
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
