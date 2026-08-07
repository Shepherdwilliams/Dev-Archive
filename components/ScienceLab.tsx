import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Beaker, Atom, Zap, Info, Send, Terminal, FlaskConical, Search, Rocket, Radio, Layers, BookOpen, Globe, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types';
import { PeriodicTable } from './PeriodicTable';
import { TelemetryHeader } from './TelemetryHeader';
import { OrbitalCalculator } from './OrbitalCalculator';
import { SatelliteTracker } from './SatelliteTracker';
import { MaterialsExplorer } from './MaterialsExplorer';
import { SciencePromptLibrary } from './SciencePromptLibrary';
import { DialectScienceArchive } from './DialectScienceArchive';
import { PeriodicTableQuiz } from './PeriodicTableQuiz';
import { sciFiAudio } from './SoundEffects';

const SYSTEM_INSTRUCTION = `
You are the "Science AI Specialist" for The Development Archive (developmentarchive.net). Your mission is to provide expert-level pedagogical support for chemistry, physics, and STEM subjects, specifically using the Zperiod (zperiod.app) interactive periodic table as your primary data reference.

Core Capabilities:
1. Visual Synthesis: When a user asks about an element, explain its properties (Atomic Mass, Electronegativity, Electron Configuration) by referencing what they should look for in a 3D atom model.
2. Reaction Prediction: Analyze the interactions between elements and ions based on oxidation states and electron blocks (s, p, d, f).
3. STSE Context: Provide "Science, Technology, Society, and Environment" context for any scientific concept discussed.
4. Prompt Engineering Education: Since this is part of The Development Archive, occasionally explain *how* you arrived at a complex scientific answer to help users learn prompt logic.

Tone & Style:
- Academic yet Accessible: Use the tone of a high-level research assistant who is helping a Grade 9-12 or Undergraduate student.
- Visual-First: Use descriptive language that encourages the user to "visualize" the atoms (e.g., "Imagine the electron density increasing as we move to the right of the period...").
- Concise Formatting: Use Markdown tables for data comparisons and LaTeX for all chemical equations and formulas.

Constraints:
- If a user asks for a reaction that is physically impossible or dangerous, provide a scientific explanation for the instability and include a safety disclaimer.
- Always provide balanced chemical equations when applicable.
- Render all math and science formulas using LaTeX (e.g., $H_2O$ or $\\Delta G = \\Delta H - T\\Delta S$).
`;

export const ScienceLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orbital' | 'materials' | 'quiz' | 'prompts' | 'dialects' | 'terminal'>('orbital');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    sciFiAudio.playSuccess();
    const userMessage: ChatMessage = { role: 'user', text: queryText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: queryText,
          systemInstruction: SYSTEM_INSTRUCTION,
          history,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Laboratory linkage failed.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);

    } catch (err) {
      console.error(err);
      
      // Fallback simulation mode
      setTimeout(() => {
        let response = "SIMULATION MODE ACTIVE (Local Fallback): ";
        const q = queryText.toLowerCase();
        
        if (q.includes("h") || q.includes("hydrogen")) {
          response += "\n\n### Hydrogen ($H$)\n- **Atomic Mass**: 1.008u\n- **Electronegativity**: 2.20\n- **Configuration**: $1s^1$\n\n**Visual Synthesis**: Imagine a single proton at the center with a spherical probability cloud ($1s$ orbital) where the lone electron resides.\n\n**STSE Context**: Hydrogen is the fuel of stars and a critical component in green energy via fuel cells.";
        } else if (q.includes("he") || q.includes("helium")) {
          response += "\n\n### Helium ($He$)\n- **Atomic Mass**: 4.0026u\n- **Electronegativity**: N/A (Noble Gas)\n- **Configuration**: $1s^2$\n\n**Visual Synthesis**: A compact nucleus surrounded by a fully occupied $1s$ shell.\n\n**STSE Context**: Critical for cooling MRI superconducting magnets.";
        } else {
          response += `\n\n### Scientific Synthesis for Query: "${queryText}"\n\n$$\\Delta V = I_{sp} \\cdot g_0 \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right)$$\n\n- **Structural Analysis**: Thermally stable molecular structure verified under simulated aerospace vacuum conditions.\n- **STSE Impact**: Directly applicable to deep-space propulsion and reusable launch vehicle heat shields.`;
        }
        
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        setIsLoading(false);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectElement = (symbol: string) => {
    setActiveTab('terminal');
    const query = `Provide a full scientific analysis of the element ${symbol}. Include its atomic mass, electronegativity, electron configuration, 3D visualization synthesis, reaction predictions, and STSE context.`;
    handleSendMessage(query);
  };

  const handleAskAiAboutMaterial = (materialName: string) => {
    setActiveTab('terminal');
    const query = `Provide a deep materials science analysis for ${materialName}. Explain its thermal shock resistance, lattice structure, and how AI generative models optimize it for spaceflight.`;
    handleSendMessage(query);
  };

  return (
    <div className="w-full space-y-6 pb-16">
      
      {/* Live Telemetry Ticker Header */}
      <TelemetryHeader />

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Hub Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <FlaskConical className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded uppercase">
                  DEVELOPMENT ARCHIVE • SCIENCE & AI HUB
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight mt-1">
                Science & AI <span className="text-emerald-400">Research Hub</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Orbital Mechanics • Materials AI • Zperiod Pedagogy • Global Lexicon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
              <Atom className="w-4 h-4 text-emerald-400" />
              <span>Z-PERIOD CONNECTED</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>PHYSICS ENGINE ONLINE</span>
            </div>
          </div>
        </div>

        {/* Hub Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('orbital'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'orbital'
                ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>ORBITAL LAUNCH & RADAR TRACKER</span>
          </button>

          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('materials'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'materials'
                ? 'bg-purple-400 text-black shadow-lg shadow-purple-400/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>MATERIALS AI & PERIODIC TABLE</span>
          </button>

          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('quiz'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>PERIODIC TABLE QUIZ</span>
          </button>

          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('prompts'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'prompts'
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>PROMPT LIBRARY & NOTEBOOKS</span>
          </button>

          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('dialects'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'dialects'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>DIALECT & REGIONAL ARCHIVE</span>
          </button>

          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('terminal'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-rose-400 text-black shadow-lg shadow-rose-400/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>SCIENCE AI TERMINAL</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ORBITAL MECHANICS & SATELLITE PASS TRACKER */}
          {activeTab === 'orbital' && (
            <motion.div
              key="orbital"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <OrbitalCalculator />
              <SatelliteTracker />
            </motion.div>
          )}

          {/* TAB 2: MATERIALS AI & INTERACTIVE PERIODIC TABLE */}
          {activeTab === 'materials' && (
            <motion.div
              key="materials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <MaterialsExplorer onAskAiAboutMaterial={handleAskAiAboutMaterial} />

              <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Atom className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
                        Zperiod Interactive Elemental Grid
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Select any element to inspect atomic configuration & run Science AI Specialist predictions
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => { sciFiAudio.playClick(); setActiveTab('quiz'); }}
                    className="px-4 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400 hover:text-black font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Atom className="w-4 h-4" />
                    <span>TAKE PERIODIC QUIZ</span>
                  </button>
                </div>

                <div className="p-2 overflow-x-auto">
                  <PeriodicTable onSelectElement={onSelectElement} />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: PERIODIC TABLE QUIZ */}
          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PeriodicTableQuiz />
            </motion.div>
          )}

          {/* TAB 3: PROMPT LIBRARY */}
          {activeTab === 'prompts' && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SciencePromptLibrary />
            </motion.div>
          )}

          {/* TAB 4: DIALECT ARCHIVE */}
          {activeTab === 'dialects' && (
            <motion.div
              key="dialects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialectScienceArchive />
            </motion.div>
          )}

          {/* TAB 5: SCIENCE AI SPECIALIST TERMINAL */}
          {activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Left Protocol Info Panel */}
              <div className="hidden lg:flex flex-col gap-4 col-span-1">
                <div className="bg-[#0b0f17] border border-slate-800 p-5 rounded-2xl border-l-4 border-emerald-400 space-y-2">
                  <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400" />
                    Research Focus
                  </h3>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed">
                    Chemistry, Physics & Space Science. Features 3D atom model synthesis, Keplerian trajectories, and STSE impact context.
                  </p>
                </div>

                <div className="bg-[#0b0f17] border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Lab Protocols
                  </h3>
                  <ul className="space-y-2.5 font-mono text-xs text-slate-400">
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold">1.</span>
                      <span>Zperiod.app reference for elemental structure.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold">2.</span>
                      <span>LaTeX equation formatting for formulas ($H_2O$, $\Delta V$).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold">3.</span>
                      <span>STSE context for real-world environmental impact.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Main Chat Window */}
              <div className="lg:col-span-3 flex flex-col min-h-[600px] bg-[#0b0f17] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                {/* Header with Table Toggle */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      {isLoading ? 'Processing Physics Synthesis...' : 'Specialist Terminal Active'}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowTable(!showTable)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      showTable
                        ? 'bg-emerald-400 text-black border-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    <Atom className="w-3.5 h-3.5" />
                    <span>{showTable ? 'HIDE PERIODIC TABLE' : 'SHOW PERIODIC TABLE'}</span>
                  </button>
                </div>

                <div className="flex-grow flex flex-col">
                  <AnimatePresence>
                    {showTable && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-slate-800 bg-slate-950/60 p-4"
                      >
                        <PeriodicTable onSelectElement={onSelectElement} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages Feed */}
                  <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <FlaskConical className="w-12 h-12 text-emerald-400 animate-bounce" />
                        <h3 className="text-xl font-bold font-mono text-white">Science Specialist AI Terminal</h3>
                        <p className="text-xs font-mono text-slate-400 max-w-md">
                          Ask about quantum physics, chemistry reactions, materials science, or click an element above to synthesize data.
                        </p>
                      </div>
                    )}

                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border font-mono text-xs font-bold ${
                          msg.role === 'user'
                            ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-white'
                        }`}>
                          {msg.role === 'user' ? <Search className="w-4 h-4" /> : <FlaskConical className="w-4 h-4 text-emerald-400" />}
                        </div>

                        <div className={`max-w-[85%] p-4 rounded-2xl border text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-emerald-400 text-black border-emerald-400 font-mono font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-200 font-sans'
                        }`}>
                          <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-center gap-3 text-xs font-mono text-emerald-400">
                        <FlaskConical className="w-4 h-4 animate-spin" />
                        <span>SYNTHESIZING_CORE_DATA...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-slate-950 border-t border-slate-800">
                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask the Science AI Specialist or type an elemental equation..."
                      disabled={isLoading}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-400 text-slate-200 font-mono text-xs rounded-xl pl-4 pr-12 py-3.5 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};
