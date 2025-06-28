import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/simpleAuthStore';

const Navbar: React.FC = () => {
  const { user, initializeUser, updateUserName } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // Initialize user on component mount
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNameEdit = () => {
    setTempName(user?.name || '');
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      updateUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName('');
    setIsEditingName(false);
  };

  return (
    <nav className="bg-surface shadow-md">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-primary hover:text-secondary">
            ArtVerse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/create" className="text-text-secondary hover:text-primary transition">
              Create Note
            </Link>
            
            {/* User Name Display/Edit */}
            {user && (
              <div className="flex items-center space-x-2">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave();
                        if (e.key === 'Escape') handleNameCancel();
                      }}
                      className="px-2 py-1 text-sm border rounded bg-background text-text-primary"
                      placeholder="Enter your name"
                      autoFocus
                    />
                    <button
                      onClick={handleNameSave}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleNameCancel}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleNameEdit}
                    className="text-text-secondary hover:text-primary text-sm flex items-center space-x-1"
                    title="Click to edit your name"
                  >
                    <span>👋 {user.name}</span>
                    <span className="text-xs">✏️</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-text-secondary hover:text-primary focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                to="/create"
                className="text-text-secondary hover:text-primary transition py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Note
              </Link>
              
              {/* Mobile User Name Display/Edit */}
              {user && (
                <div className="py-2">
                  {isEditingName ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNameSave();
                          if (e.key === 'Escape') handleNameCancel();
                        }}
                        className="px-2 py-1 text-sm border rounded bg-background text-text-primary flex-1"
                        placeholder="Enter your name"
                        autoFocus
                      />
                      <button
                        onClick={handleNameSave}
                        className="text-green-600 hover:text-green-700 text-sm px-2"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleNameCancel}
                        className="text-red-600 hover:text-red-700 text-sm px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleNameEdit}
                      className="text-text-secondary hover:text-primary text-sm flex items-center space-x-2 w-full text-left"
                      title="Click to edit your name"
                    >
                      <span>👋 {user.name}</span>
                      <span className="text-xs">✏️</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
