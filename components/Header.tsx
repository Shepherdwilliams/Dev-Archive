
import React from 'react';
import { motion } from 'framer-motion';
import type { View } from '../App';

interface HeaderProps {
  setView: (view: View) => void;
  currentView: View;
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
      className="relative px-3 py-2 text-sm font-medium transition-colors duration-300"
    >
      <span className={`relative z-10 ${isActive ? 'text-brand-black' : 'text-brand-light-gray hover:text-white'}`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-brand-green rounded-md"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ setView, currentView }) => {
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
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <NavLink view="home" currentView={currentView} setView={setView}>Home</NavLink>
              <NavLink view="modules" currentView={currentView} setView={setView}>Modules</NavLink>
              <NavLink view="agents" currentView={currentView} setView={setView}>Bots & Agents</NavLink>
              <NavLink view="quiz" currentView={currentView} setView={setView}>Quiz</NavLink>
              <NavLink view="glossary" currentView={currentView} setView={setView}>Glossary</NavLink>
              <NavLink view="chat" currentView={currentView} setView={setView}>AI Chat</NavLink>
              <NavLink view="science" currentView={currentView} setView={setView}>Science Lab</NavLink>
              <NavLink view="store" currentView={currentView} setView={setView}>Store</NavLink>
              <button 
                onClick={() => setView('contact')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                  currentView === 'contact'
                  ? 'bg-brand-green text-brand-black border border-brand-green font-bold'
                  : 'border border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-black'
                }`}
              >
                Contact
              </button>
            </div>
            {/* Mobile Nav Options */}
            <div className="flex md:hidden items-center space-x-1 overflow-x-auto py-2">
              <button
                onClick={() => setView('modules')}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${currentView === 'modules' ? 'bg-brand-green text-brand-black font-bold' : 'text-brand-light-gray'}`}
              >
                Modules
              </button>
              <button
                onClick={() => setView('agents')}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${currentView === 'agents' ? 'bg-brand-green text-brand-black font-bold' : 'text-brand-green border border-brand-green/40'}`}
              >
                🤖 Agents
              </button>
              <button
                onClick={() => setView('chat')}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${currentView === 'chat' ? 'bg-brand-green text-brand-black font-bold' : 'text-brand-light-gray'}`}
              >
                Chat
              </button>
              <button
                onClick={() => setView('quiz')}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${currentView === 'quiz' ? 'bg-brand-green text-brand-black font-bold' : 'text-brand-light-gray'}`}
              >
                Quiz
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
