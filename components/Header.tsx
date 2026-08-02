
import React from 'react';
import { motion } from 'framer-motion';
import type { View } from '../App';

interface HeaderProps {
  setView: (view: View) => void;
  currentView: View;
  onReplayIntro?: () => void;
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
      className="relative px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-200 cursor-pointer"
    >
      <span className={`relative z-10 transition-colors ${isActive ? 'text-brand-black font-bold' : 'text-brand-light-gray hover:text-white'}`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-brand-green rounded-md"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ setView, currentView, onReplayIntro }) => {
  return (
    <header className="sticky top-0 z-50">
      <nav className="border-b border-brand-border bg-brand-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Mark */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setView('home')} 
                className="flex items-center space-x-2 text-white font-bold tracking-tight text-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-brand-green flex items-center justify-center text-brand-black font-mono text-xs font-black">
                  Z
                </div>
                <span>
                  <span className="text-brand-green font-mono">DEV</span>.ARCHIVE
                </span>
              </button>

              <span className="hidden xl:inline-flex items-center text-[10px] font-mono uppercase bg-brand-green/10 text-brand-green border border-brand-green/30 px-2 py-0.5 rounded">
                v2026.1
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 border border-brand-border/80 bg-brand-gray-dark/60 p-1 rounded-lg">
              <NavLink view="home" currentView={currentView} setView={setView}>Home</NavLink>
              <NavLink view="modules" currentView={currentView} setView={setView}>Modules</NavLink>
              <NavLink view="agents" currentView={currentView} setView={setView}>🤖 Bots & Agents</NavLink>
              <NavLink view="services" currentView={currentView} setView={setView}>💼 Services</NavLink>
              <NavLink view="quiz" currentView={currentView} setView={setView}>Quiz</NavLink>
              <NavLink view="glossary" currentView={currentView} setView={setView}>Glossary</NavLink>
              <NavLink view="chat" currentView={currentView} setView={setView}>AI Chat</NavLink>
              <NavLink view="science" currentView={currentView} setView={setView}>Science Lab</NavLink>
              <NavLink view="store" currentView={currentView} setView={setView}>Store</NavLink>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              {onReplayIntro && (
                <button
                  onClick={onReplayIntro}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase bg-brand-gray-dark border border-brand-border text-brand-green hover:bg-brand-green hover:text-brand-black transition-all duration-200 cursor-pointer flex items-center space-x-1.5"
                  title="Play Intro Video Sequence"
                >
                  <span>🎬</span>
                  <span>Intro</span>
                </button>
              )}
              <button 
                onClick={() => setView('contact')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  currentView === 'contact'
                  ? 'bg-brand-green text-brand-black font-extrabold shadow-md'
                  : 'border border-brand-green/60 text-brand-green hover:bg-brand-green hover:text-brand-black'
                }`}
              >
                Contact
              </button>
            </div>

            {/* Mobile Nav Options */}
            <div className="flex lg:hidden items-center space-x-1.5 overflow-x-auto py-2 no-scrollbar">
              <button
                onClick={() => setView('home')}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'home' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Home
              </button>
              <button
                onClick={() => setView('services')}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'services' ? 'bg-brand-green text-brand-black' : 'text-brand-green border border-brand-green/40'}`}
              >
                💼 Services
              </button>
              <button
                onClick={() => setView('modules')}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'modules' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Modules
              </button>
              <button
                onClick={() => setView('agents')}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'agents' ? 'bg-brand-green text-brand-black' : 'text-brand-green border border-brand-green/40'}`}
              >
                🤖 Agents
              </button>
              <button
                onClick={() => setView('chat')}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'chat' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Chat
              </button>
              <button
                onClick={() => setView('quiz')}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'quiz' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Quiz
              </button>
              <button
                onClick={() => setView('science')}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'science' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Science
              </button>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
};

