import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '~/store/useAuthStore';
// import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Example for mobile menu toggle

const Navbar: React.FC = () => {
  const { isAuthenticated, principal, login, logout } = useAuthStore();
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile menu

  return (
    <nav className="bg-neutral-darker/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:opacity-80 transition-opacity">
              NoteChain
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <Link to="/create" className="text-neutral-light hover:text-brand-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Create Note
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <div className="flex items-center">
                  <span className="text-neutral-light text-sm truncate max-w-[100px] md:max-w-[150px] lg:max-w-xs" title={principal!}>
                    {principal}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-status-error/80 hover:bg-status-error text-neutral-lightest font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/80 hover:to-brand-secondary/80 text-neutral-lightest font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
          {/* Mobile menu button (basic placeholder) */}
          {/* <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-light hover:text-brand-accent">
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div> */}
        </div>
      </div>
      {/* Mobile menu (basic placeholder, would need more logic) */}
      {/* {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-darker/90 backdrop-blur-md py-2">
          {isAuthenticated && (
            <Link to="/create" className="block text-neutral-light hover:text-brand-accent px-4 py-2 text-sm">Create Note</Link>
          )}
          {isAuthenticated ? (
             <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left text-status-error hover:bg-status-error/20 px-4 py-2 text-sm">Logout</button>
          ) : (
            <button onClick={() => { login(); setMobileMenuOpen(false); }} className="block w-full text-left text-brand-primary hover:bg-brand-primary/20 px-4 py-2 text-sm">Login</button>
          )}
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;
