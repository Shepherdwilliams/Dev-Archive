import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  GitCompare, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  Sparkles, 
  Wand2, 
  ShieldAlert, 
  DollarSign, 
  Clock, 
  HelpCircle,
  Code,
  FileText,
  Sliders
} from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

export const PromptTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'diff'>('calculator');

  // Token Estimator State
  const [sampleText, setSampleText] = useState<string>(
    `You are a Senior Full-Stack Engineer and AI Systems Architect.
Your role is to audit React TypeScript codebases and convert inline CSS styles to Tailwind CSS utilities while ensuring zero layout shifts, strict type checking, and clean React hook dependencies.`
  );
  const [copiedTokenText, setCopiedTokenText] = useState<boolean>(false);

  // Prompt Diff State
  const [selectedDiffPreset, setSelectedDiffPreset] = useState<number>(0);
  const [rawPromptInput, setRawPromptInput] = useState<string>(
    `Make an AI bot that checks user code and changes inline styles to Tailwind CSS.`
  );
  const [copiedDiff, setCopiedDiff] = useState<boolean>(false);

  const diffPresets = [
    {
      title: 'React Code Auditor & Tailwind Refactor',
      raw: 'Make an AI bot that checks user code and changes inline styles to Tailwind CSS.',
      optimized: `### SYSTEM INSTRUCTION: Full-Stack React & Tailwind Auditor
Role: Senior React 18 & Tailwind CSS Specialist.
Goal: Transform legacy JSX/TSX with inline styles into clean, accessible Tailwind utility classes.

Directives & Guardrails:
1. Preserve all existing prop interfaces, state hooks, and event handlers.
2. Convert all style={{...}} objects to Tailwind CSS classes (e.g. padding: 16 -> p-4).
3. Enforce WCAG AA color contrast and add hover: and focus: states where appropriate.
4. Output ONLY valid TypeScript TSX code wrapped in markdown codeblocks. No conversational filler.`
    },
    {
      title: 'Customer Support Anti-Hallucination Guardrail',
      raw: 'Create a chatbot for our e-commerce store to answer questions about orders.',
      optimized: `### SYSTEM INSTRUCTION: Customer Support Agent
Role: Customer Service Representative for Zenith Merch Co.
Knowledge Boundary: You are strictly limited to official order lookup data provided in session context.

Strict Security Constraints:
1. DO NOT fabricate, guess, or estimate order shipping dates or tracking numbers.
2. If an order ID is missing or invalid, ask the user to provide a valid 8-character Order ID.
3. For refund requests older than 30 days, politely decline according to Policy #402 and route to human support.
4. Maintain a polite, professional, and helpful tone at all times.`
    },
    {
      title: 'SBIR Grant & Proposal Generator',
      raw: 'Write a grant proposal section for our AI education tool.',
      optimized: `### SYSTEM INSTRUCTION: NSF SBIR Phase I Grant Architect
Role: Principal Grant Writer & Technical Proposal Strategist.
Goal: Draft compelling, compliant narratives for Federal SBIR/STTR Solicitations.

Section Guidelines:
1. Intellectual Merit: Define the technological novelty, algorithmic innovation, and feasibility metrics.
2. Broader Impacts: Detail educational accessibility, STEM workforce development, and underrepresented student reach.
3. Commercialization Plan: Outline target customer segments, unit economics, and 3-year market penetration goals.
4. Format output using clear H2 headers, bulleted milestones, and formal academic prose.`
    }
  ];

  // Token Calculation Logic (~4 characters = 1 token average)
  const tokenMetrics = useMemo(() => {
    const chars = sampleText.length;
    const words = sampleText.trim() ? sampleText.trim().split(/\s+/).length : 0;
    const estimatedTokens = Math.ceil(chars / 4);

    // Pricing models (per 1M tokens)
    const geminiFlashCost = ((estimatedTokens / 1000000) * 0.075).toFixed(6);
    const geminiProCost = ((estimatedTokens / 1000000) * 1.25).toFixed(6);
    const claudeSonnetCost = ((estimatedTokens / 1000000) * 3.00).toFixed(6);
    const gpt4oCost = ((estimatedTokens / 1000000) * 2.50).toFixed(6);

    // Efficiency Score (0-100)
    const redundancyWords = (sampleText.match(/\b(please|kindly|in order to|as an AI|i want you to)\b/gi) || []).length;
    const efficiencyScore = Math.max(10, 100 - redundancyWords * 15);

    return {
      chars,
      words,
      estimatedTokens,
      geminiFlashCost,
      geminiProCost,
      claudeSonnetCost,
      gpt4oCost,
      efficiencyScore,
      redundancyCount: redundancyWords
    };
  }, [sampleText]);

  const handleCopyText = (text: string, setCopiedFn: (val: boolean) => void) => {
    sciFiAudio.playSuccess();
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  const handleSelectPreset = (idx: number) => {
    sciFiAudio.playClick();
    setSelectedDiffPreset(idx);
    setRawPromptInput(diffPresets[idx].raw);
  };

  return (
    <div className="space-y-8">
      {/* Top Tool Switcher Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('calculator'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Token & Cost Calculator</span>
          </button>

          <button
            onClick={() => { sciFiAudio.playClick(); setActiveTab('diff'); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'diff'
                ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Prompt Optimization Diff</span>
          </button>
        </div>

        <a
          href="https://aistudio.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:bg-emerald-500/10 cursor-pointer"
        >
          <span>Launch AI Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* TAB 1: TOKEN & COST CALCULATOR */}
      {activeTab === 'calculator' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Panel: Input Area */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  Prompt Text Input
                </h3>
              </div>
              <button
                onClick={() => handleCopyText(sampleText, setCopiedTokenText)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                {copiedTokenText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTokenText ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <textarea
              rows={10}
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Paste your system instruction or user prompt here to calculate token density and model pricing..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400 leading-relaxed resize-none"
            />

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                LOAD SAMPLE SYSTEM PROMPTS:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSampleText(`You are a Principal Full-Stack Engineer and AI Systems Architect.\nYour role is to audit React TypeScript codebases and convert inline CSS styles to Tailwind CSS utilities while ensuring zero layout shifts, strict type checking, and clean React hook dependencies.`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono cursor-pointer"
                >
                  React Code Auditor
                </button>
                <button
                  onClick={() => setSampleText(`You are an Expert System Instruction Architect specializing in Gemini 1.5 Pro and Claude 3.5 Sonnet.\nConstruct a multi-step Chain-of-Thought prompt that validates regional slang authenticity, checks for negative constraints, and enforces JSON schema compliance.`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono cursor-pointer"
                >
                  CoT Mega-Prompt
                </button>
                <button
                  onClick={() => setSampleText(`You are a Federal SBIR/STTR Grant Proposal Writer.\nDraft an Intellectual Merit and Broader Impact narrative for an AI-powered interactive periodic table educational platform designed for Grade 9-12 chemistry students.`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono cursor-pointer"
                >
                  SBIR Grant Proposal
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Metrics & Cost Matrix */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Realtime Counter Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">CHARACTERS</span>
                <span className="text-xl font-mono font-black text-white mt-1 block">
                  {tokenMetrics.chars}
                </span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">WORDS</span>
                <span className="text-xl font-mono font-black text-white mt-1 block">
                  {tokenMetrics.words}
                </span>
              </div>
              <div className="bg-slate-900/60 border border-emerald-500/40 bg-emerald-500/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">TOKENS (EST.)</span>
                <span className="text-xl font-mono font-black text-emerald-400 mt-1 block">
                  ~{tokenMetrics.estimatedTokens}
                </span>
              </div>
            </div>

            {/* Price Matrix Comparison */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  Model Cost Breakdown (Per Query)
                </h4>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Gemini 1.5 Flash */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-white font-bold block">Gemini 1.5 Flash</span>
                      <span className="text-[10px] text-slate-500">$0.075 / 1M tokens</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">${tokenMetrics.geminiFlashCost}</span>
                </div>

                {/* Gemini 1.5 Pro */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-white font-bold block">Gemini 1.5 Pro</span>
                      <span className="text-[10px] text-slate-500">$1.25 / 1M tokens</span>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-bold">${tokenMetrics.geminiProCost}</span>
                </div>

                {/* Claude 3.5 Sonnet */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-white font-bold block">Claude 3.5 Sonnet</span>
                      <span className="text-[10px] text-slate-500">$3.00 / 1M tokens</span>
                    </div>
                  </div>
                  <span className="text-purple-400 font-bold">${tokenMetrics.claudeSonnetCost}</span>
                </div>

                {/* OpenAI GPT-4o */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-white font-bold block">OpenAI GPT-4o</span>
                      <span className="text-[10px] text-slate-500">$2.50 / 1M tokens</span>
                    </div>
                  </div>
                  <span className="text-amber-400 font-bold">${tokenMetrics.gpt4oCost}</span>
                </div>
              </div>

              {/* Token Efficiency Feedback */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    EFFICIENCY SCORE:
                  </span>
                  <span className={`text-xs font-mono font-bold ${tokenMetrics.efficiencyScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {tokenMetrics.efficiencyScore}/100
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${tokenMetrics.efficiencyScore >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${tokenMetrics.efficiencyScore}%` }}
                  />
                </div>

                {tokenMetrics.redundancyCount > 0 && (
                  <p className="text-[11px] text-amber-400/90 font-mono mt-1">
                    ⚠️ Detected {tokenMetrics.redundancyCount} conversational filler phrases (e.g. "please", "in order to"). Removing these saves tokens and increases response precision.
                  </p>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* TAB 2: PROMPT OPTIMIZATION DIFF VIEWER */}
      {activeTab === 'diff' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Preset Buttons */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-3">
              SELECT PROMPT OPTIMIZATION ARCHETYPE:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {diffPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedDiffPreset === idx
                      ? 'bg-emerald-500/10 border-emerald-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-xs font-bold block mb-1">
                    {preset.title}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-2">
                    {preset.raw}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-Side Comparison Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BEFORE: Raw User Prompt */}
            <div className="bg-slate-900/60 border border-rose-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <h4 className="text-sm font-bold text-rose-400 font-mono uppercase">
                    BEFORE: Raw User Prompt
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  UNSTRUCTURED
                </span>
              </div>

              <textarea
                rows={12}
                value={rawPromptInput}
                onChange={(e) => setRawPromptInput(e.target.value)}
                placeholder="Enter raw user prompt..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-rose-400 leading-relaxed resize-none"
              />

              <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
                ❌ Potential Issues: Ambiguous constraints, missing role persona, high risk of hallucination or off-topic outputs.
              </p>
            </div>

            {/* AFTER: Optimized AI Studio System Instruction */}
            <div className="bg-slate-900/60 border border-emerald-500/40 bg-emerald-500/5 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-sm font-bold text-emerald-400 font-mono uppercase">
                    AFTER: Optimized AI Studio Blueprint
                  </h4>
                </div>
                <button
                  onClick={() => handleCopyText(diffPresets[selectedDiffPreset].optimized, setCopiedDiff)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-mono font-bold cursor-pointer"
                >
                  {copiedDiff ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDiff ? 'COPIED' : 'COPY OPTIMIZED'}</span>
                </button>
              </div>

              <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {diffPresets[selectedDiffPreset].optimized}
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  ✓ Includes Explicit Persona, Directives & Structural Constraints
                </span>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Use in AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
};
