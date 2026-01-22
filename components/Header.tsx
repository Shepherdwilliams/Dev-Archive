
import React from 'react';
import type { Models } from 'appwrite';
import type { View } from '../App';

interface HeaderProps {
  setView: (view: View) => void;
  currentView: View;
  currentUser: Models.User<Models.Preferences> | null;
  onLogout: () => void;
}

const NavLink: React.FC<{
  view: View;
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}> = ({ view, currentView, setView, children }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => setView(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
        isActive
          ? 'bg-brand-green text-brand-black'
          : 'text-brand-light-gray hover:bg-brand-gray-dark hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ setView, currentView, currentUser, onLogout }) => {
  return (
    <header className="sticky top-0 z-50">
      <nav className="border-b border-brand-border/50 bg-brand-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => setView('home')} className="flex-shrink-0 text-white text-xl font-bold tracking-wider">
                <span className="text-brand-green">Dev</span> Archive
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <NavLink view="home" currentView={currentView} setView={setView}>Home</NavLink>
              <NavLink view="modules" currentView={currentView} setView={setView}>Modules</NavLink>
              <NavLink view="quiz" currentView={currentView} setView={setView}>Quiz</NavLink>
              <NavLink view="glossary" currentView={currentView} setView={setView}>Glossary</NavLink>
            </div>
             <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-brand-light-gray">Welcome, {currentUser?.email}</span>
                <button 
                    onClick={onLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 bg-brand-red/80 text-white hover:bg-brand-red"
                >
                    Logout
                </button>
            </div>
            <div className="md:hidden">
              {/* Mobile menu could be adapted here */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
