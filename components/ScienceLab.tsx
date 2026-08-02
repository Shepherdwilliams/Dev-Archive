import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Beaker, Atom, Zap, Info, Send, Terminal, FlaskConical, Search } from 'lucide-react';
import type { ChatMessage } from '../types';
import { PeriodicTable } from './PeriodicTable';

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
- Render all math and science formulas using LaTeX (e.g., $H_2O$ or $\Delta G = \Delta H - T\Delta S$).
`;

export const ScienceLab: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTable, setShowTable] = useState(true);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<any>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (queryText: string) => {
        if (!queryText.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: queryText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Map messages to history format
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
            
            // Fallback for simulation mode if API fails or is not configured
            setTimeout(() => {
                let response = "SIMULATION MODE ACTIVE (Local Fallback): ";
                const q = queryText.toLowerCase();
                
                if (q.includes("h") || q.includes("hydrogen")) {
                    response += "\n\n### Hydrogen ($H$)\n- **Atomic Mass**: 1.008u\n- **Electronegativity**: 2.20\n- **Configuration**: $1s^1$\n\n**Visual Synthesis**: Imagine a single proton at the center with a spherical probability cloud ($1s$ orbital) where the lone electron resides. It is the simplest and most abundant element in the universe.\n\n**STSE Context**: Hydrogen is the fuel of stars and a critical component in the transition to green energy via hydrogen fuel cells.";
                } else if (q.includes("he") || q.includes("helium")) {
                    response += "\n\n### Helium ($He$)\n- **Atomic Mass**: 4.0026u\n- **Electronegativity**: N/A (Noble Gas)\n- **Configuration**: $1s^2$\n\n**Visual Synthesis**: A compact nucleus with two protons and two neutrons, surrounded by a fully occupied $1s$ shell. The symmetry makes it chemically inert.\n\n**STSE Context**: Rare on Earth, Helium is critical for cooling MRI magnets and deep-sea diving mixtures.";
                } else if (q.includes("li") || q.includes("lithium")) {
                    response += "\n\n### Lithium ($Li$)\n- **Atomic Mass**: 6.94u\n- **Electronegativity**: 0.98\n- **Configuration**: $[He] 2s^1$\n\n**Visual Synthesis**: Visualize the core $1s$ shell tightly bound, while a single electron sits in the much larger $2s$ orbital. This lone valence electron is easily lost, leading to high reactivity.\n\n**STSE Context**: The backbone of the modern mobile revolution through Lithium-ion batteries.";
                } else {
                    response += "\n\nI am currently in **Offline Simulation Mode**. Laboratory linkage failed. Please check your transmission or API key configuration.";
                }
                
                setMessages(prev => [...prev, { role: 'model', text: response }]);
                setIsLoading(false);
            }, 1000);
        } finally {
            setIsLoading(false);
        }
    };

    const onSelectElement = (symbol: string) => {
        const query = `Provide a full scientific analysis of the element ${symbol}. Include its atomic mass, electronegativity, electron configuration, 3D visualization synthesis, reaction predictions, and STSE context.`;
        handleSendMessage(query);
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-180px)]">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-green/20 flex items-center justify-center border border-brand-green/30">
                        <FlaskConical className="text-brand-green w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Science <span className="text-brand-green">Lab</span></h1>
                        <p className="text-brand-light-gray flex items-center gap-2">
                             <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                             Pedagogical Support Terminal v2.4
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs font-mono text-brand-light-gray">
                    <div className="flex items-center gap-2">
                        <Atom className="w-4 h-4 text-brand-green" />
                        <span>Z-PERIOD CONNECTED</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-brand-green" />
                        <span>QUANTUM SYNC ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
                {/* Side Info Panel */}
                <div className="hidden lg:flex flex-col gap-4 col-span-1 h-full overflow-y-auto pr-2">
                    <div className="tech-card p-5 rounded-xl border-l-4 border-brand-green">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-brand-green" />
                            Research Focus
                        </h3>
                        <p className="text-xs text-brand-light-gray leading-relaxed">
                            Specializing in Chemistry & Physics visualization. Using 3D atom model synthesis and STSE context as primary analytical lenses.
                        </p>
                    </div>

                    <div className="tech-card p-5 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-brand-green" />
                            Lab Protocols
                        </h3>
                        <ul className="space-y-3">
                            <li className="text-[10px] md:text-xs text-brand-light-gray flex gap-2">
                                <span className="text-brand-green font-bold">1.</span>
                                <span>Reference Zperiod.app for elemental properties.</span>
                            </li>
                            <li className="text-[10px] md:text-xs text-brand-light-gray flex gap-2">
                                <span className="text-brand-green font-bold">2.</span>
                                <span>Visualize electron density and orbital configuration.</span>
                            </li>
                            <li className="text-[10px] md:text-xs text-brand-light-gray flex gap-2">
                                <span className="text-brand-green font-bold">3.</span>
                                <span>Analysis includes society and environment context.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-auto bg-brand-green/5 p-4 rounded-xl border border-brand-green/20">
                         <p className="text-[10px] font-mono text-brand-green/70">
                            SESSION_ID: DEV_ARCHIVE_88x2
                            STATUS: ENCRYPTION_STABLE
                         </p>
                    </div>
                </div>

                {/* Main Research Terminal */}
                <div className="lg:col-span-3 flex flex-col h-full bg-brand-black/40 rounded-2xl border border-brand-border overflow-hidden">
                    {/* Header with Table Toggle */}
                    <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-black/20">
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-brand-green animate-pulse' : 'bg-brand-green'}`} />
                             <span className="text-[10px] font-mono text-brand-light-gray uppercase tracking-widest">
                                {isLoading ? 'Processing Query...' : 'Interface Ready'}
                             </span>
                        </div>
                        <button 
                            onClick={() => setShowTable(!showTable)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-mono border transition-all ${
                                showTable 
                                ? 'bg-brand-green/20 border-brand-green/50 text-brand-green' 
                                : 'bg-brand-gray-dark border-brand-border text-brand-light-gray hover:border-brand-green/50'
                            }`}
                        >
                            <Atom className="w-3 h-3" />
                            {showTable ? 'HIDE TABLE' : 'SHOW TABLE'}
                        </button>
                    </div>

                    <div className="flex-grow flex flex-col overflow-hidden">
                        <AnimatePresence>
                            {showTable && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden border-b border-brand-border bg-brand-black/20"
                                >
                                    <div className="p-4 max-h-[350px] overflow-y-auto">
                                        <PeriodicTable onSelectElement={onSelectElement} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-brand-border">
                            {messages.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col items-center justify-center p-4"
                                >
                                    <div className="text-center mb-6 max-w-2xl">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Science Specialist Terminal</h2>
                                        <p className="text-brand-light-gray text-sm md:text-base">
                                            Select an element above or enter a custom query below to begin your visual and chemical synthesis.
                                        </p>
                                    </div>
                                    
                                    {!showTable && (
                                        <button 
                                            onClick={() => setShowTable(true)}
                                            className="px-8 py-4 bg-brand-green/10 border border-brand-green/30 rounded-2xl text-brand-green hover:bg-brand-green/20 transition-all flex flex-col items-center gap-4 group"
                                        >
                                            <Atom className="w-12 h-12 group-hover:rotate-180 transition-transform duration-700" />
                                            <span className="font-bold tracking-widest text-sm">ACTIVATE Z-PERIOD INTERFACE</span>
                                        </button>
                                    )}

                                    <div className="mt-12 flex items-center gap-4 text-brand-light-gray/40 text-[10px] font-mono uppercase tracking-[0.3em]">
                                        <span className="h-px w-12 bg-white/10" />
                                        Awaiting Core Interface Activation
                                        <span className="h-px w-12 bg-white/10" />
                                    </div>
                                </motion.div>
                            )}
                            
                            {messages.map((msg, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={index} 
                                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border shadow-lg ${
                                        msg.role === 'user' 
                                        ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' 
                                        : 'bg-brand-border border-brand-border text-white'
                                    }`}>
                                        {msg.role === 'user' ? <Search className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
                                    </div>
                                    <div className={`max-w-[85%] p-4 md:p-6 rounded-2xl shadow-2xl ${
                                        msg.role === 'user' 
                                        ? 'bg-brand-green text-brand-black font-semibold' 
                                        : 'bg-brand-gray-dark border border-brand-border text-white'
                                    }`}>
                                        <div className="prose prose-sm md:prose-base prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-brand-black/50 prose-pre:border prose-pre:border-brand-border prose-table:text-xs">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkMath]} 
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                                <div className="flex items-start gap-4 animate-pulse">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-border border border-brand-border flex items-center justify-center text-white">
                                        <FlaskConical className="w-5 h-5" />
                                    </div>
                                    <div className="max-w-[85%] p-6 rounded-2xl bg-brand-gray-dark border border-brand-border">
                                        <div className="flex gap-3 items-center text-brand-green font-mono text-xs md:text-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                            SYNTHESIZING_CORE_DATA...
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 md:p-6 bg-brand-black/60 border-t border-brand-border">
                        {error && <p className="text-center text-brand-red mb-4 font-mono text-xs">{error}</p>}
                        
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Select an element above or type a custom query..."
                                disabled={isLoading}
                                className="w-full p-4 pl-6 pr-14 bg-brand-gray-dark border border-brand-border rounded-xl text-white placeholder-brand-light-gray/20 focus:outline-none focus:ring-1 focus:ring-brand-green/30 disabled:opacity-50 transition-all font-mono text-sm"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-green text-brand-black rounded-lg hover:bg-brand-green-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="mt-4 text-[10px] text-center text-brand-light-gray/40 font-mono uppercase tracking-[0.2em]">
                            End-User Pedagogical Interface // Google Gemini 1.5 Pro
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
