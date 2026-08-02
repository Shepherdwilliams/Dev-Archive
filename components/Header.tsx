import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { View } from '../App';
import { sciFiAudio } from './SoundEffects';

interface HeaderProps {
  setView: (view: View) => void;
  currentView: View;
  onReplayIntro?: () => void;
  starfieldEnabled: boolean;
  setStarfieldEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavLink: React.FC<{
  view: View;
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}> = ({ view, currentView, setView, children }) => {
  const isActive = view === currentView;
  const handleClick = () => {
    sciFiAudio.playClick();
    setView(view);
  };

  return (
    <button
      onClick={handleClick}
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

export const Header: React.FC<HeaderProps> = ({ 
  setView, 
  currentView, 
  onReplayIntro,
  starfieldEnabled,
  setStarfieldEnabled
}) => {
  return (
    <header className="sticky top-0 z-50">
      {/* Top Live Ticker Banner */}
      <div className="bg-slate-950 border-b border-brand-border/60 py-1 px-4 font-mono text-[11px] text-brand-light-gray flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-brand-green font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            LIVE TICKER:
          </span>
          <span>⚡ Gemini 1.5 Pro Operational</span>
          <span className="text-slate-600">•</span>
          <span>🤖 10 Autonomous Agents Online</span>
          <span className="text-slate-600">•</span>
          <span>🧪 24/7 Zperiod Science Engine Active</span>
        </div>

        <button
          onClick={() => {
            sciFiAudio.playClick();
            setStarfieldEnabled(prev => !prev);
          }}
          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-4 ${
            starfieldEnabled ? 'bg-brand-green/20 text-brand-green border border-brand-green/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
          title="Toggle Canvas Starfield FX"
        >
          <Sparkles className="w-3 h-3" />
          <span>Starfield FX: {starfieldEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <nav className="border-b border-brand-border bg-brand-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Mark */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => { sciFiAudio.playClick(); setView('home'); }} 
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
                  onClick={() => { sciFiAudio.playClick(); onReplayIntro(); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase bg-brand-gray-dark border border-brand-border text-brand-green hover:bg-brand-green hover:text-brand-black transition-all duration-200 cursor-pointer flex items-center space-x-1.5"
                  title="Play Intro Video Sequence"
                >
                  <span>🎬</span>
                  <span>Intro</span>
                </button>
              )}
              <button 
                onClick={() => { sciFiAudio.playClick(); setView('contact'); }}
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
                onClick={() => { sciFiAudio.playClick(); setView('home'); }}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'home' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Home
              </button>
              <button
                onClick={() => { sciFiAudio.playClick(); setView('services'); }}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'services' ? 'bg-brand-green text-brand-black' : 'text-brand-green border border-brand-green/40'}`}
              >
                💼 Services
              </button>
              <button
                onClick={() => { sciFiAudio.playClick(); setView('modules'); }}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'modules' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Modules
              </button>
              <button
                onClick={() => { sciFiAudio.playClick(); setView('agents'); }}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'agents' ? 'bg-brand-green text-brand-black' : 'text-brand-green border border-brand-green/40'}`}
              >
                🤖 Agents
              </button>
              <button
                onClick={() => { sciFiAudio.playClick(); setView('chat'); }}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'chat' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Chat
              </button>
              <button
                onClick={() => { sciFiAudio.playClick(); setView('quiz'); }}
                className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${currentView === 'quiz' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray'}`}
              >
                Quiz
              </button>
              <button
                onClick={() => { sciFiAudio.playClick(); setView('science'); }}
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
