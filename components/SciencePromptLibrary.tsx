import React, { useState } from 'react';
import { Copy, Check, ExternalLink, BookOpen, Terminal, Sparkles, FileCode, CheckCircle2 } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

export interface SciencePrompt {
  id: string;
  title: string;
  category: string;
  description: string;
  promptText: string;
  recommendedModel: string;
}

export const sciencePromptsList: SciencePrompt[] = [
  {
    id: 'telemetry-anomaly',
    title: 'Satellite Telemetry Anomaly Detector',
    category: 'Space Technology & AI',
    description: 'System instruction prompt for ingesting raw JSON or CSV satellite sensor streams, calculating z-score sensor deviations, and predicting thermal runaway or power bus drops.',
    recommendedModel: 'Gemini 1.5 Pro (32k+ Window)',
    promptText: `### SYSTEM INSTRUCTION: Satellite Telemetry Anomaly Detector
Role: Flight Operations Telemetry Engineer & AI Systems Auditor.
Task: Ingest real-time satellite sensor streams (voltage, reaction wheel RPM, temperature, solar array current) and detect anomalies.

Directives:
1. Parse input sensor data and compare against nominal operating envelopes:
   - Battery Bus Voltage: 28.0V ± 1.5V
   - Reaction Wheel Alpha RPM: 1,200 - 3,500 RPM
   - Avionics Thermal Sensor: -20°C to +55°C
2. If any metric strays past ±2.5 standard deviations, output an ANOMALY WARNING with severity level (CRITICAL / HIGH / MEDIUM).
3. Provide root-cause hypothesis and immediate safing maneuvers for spacecraft controllers.`
  },
  {
    id: 'orbital-solver',
    title: 'Orbital Mechanics & Delta-V Equation Solver',
    category: 'Physics & Aerospace',
    description: 'Step-by-step physics solver prompt that computes Hohmann transfer orbits, inclination change delta-v requirements, and Keplerian orbital parameters in LaTeX.',
    recommendedModel: 'Gemini 1.5 Pro / Flash',
    promptText: `### SYSTEM INSTRUCTION: Orbital Mechanics & Delta-V Physics Engine
Role: Principal Orbital Mechanic & Astrodynamics Specialist.
Task: Solve two-body orbital transfer problems step-by-step using precise LaTeX formulas.

Equations to Enforce:
- Circular Speed: $v = \\sqrt{\\frac{\\mu}{r}}$
- Vis-Viva Equation: $v^2 = \\mu \\left( \\frac{2}{r} - \\frac{1}{a} \\right)$
- Hohmann Transfer Delta-V: $\\Delta V_1 = \\sqrt{\\frac{\\mu}{r_1}} \\left( \\sqrt{\\frac{2 r_2}{r_1 + r_2}} - 1 \\right)$

Instructions:
1. Break down given initial orbit $r_1$, final orbit $r_2$, and gravitational parameter $\\mu$.
2. Show step-by-step mathematical substitution.
3. Express all final speeds in $km/s$ or $m/s$ with explicit safety margins.`
  },
  {
    id: 'dataset-graph-gen',
    title: 'Dataset-to-Graph Visualization Generator',
    category: 'Data Science & STEM',
    description: 'Transforms unformatted scientific raw tabular data into executable Python (Matplotlib / Seaborn) and React Recharts code blocks.',
    recommendedModel: 'Gemini 1.5 Flash',
    promptText: `### SYSTEM INSTRUCTION: Scientific Data Visualization Specialist
Role: Data Visualization Engineer & Python / React Chart Architect.
Goal: Convert raw experimental CSV or JSON datasets into publication-ready graphs.

Instructions:
1. Accept raw dataset strings (e.g. temperature vs time, spectroscopy absorption spectra).
2. Generate clean Python Matplotlib/Seaborn script AND React Recharts TSX component.
3. Enforce high-contrast dark themes (#0B0F17 background, cyan/emerald plot lines, explicit axis labels with units).
4. Include error bars or confidence intervals where statistical variance exists.`
  },
  {
    id: 'physics-lab-sim',
    title: 'STEM Lesson Plan & Physics Lab Simulator',
    category: 'STEM Pedagogy',
    description: 'Generates interactive Grade 9-12 or Undergraduate physics lab experiments, complete with hypothesis questions, apparatus requirements, and simulation code.',
    recommendedModel: 'Gemini 1.5 Pro',
    promptText: `### SYSTEM INSTRUCTION: Interactive STEM Physics Lab Architect
Role: Lead STEM Educator & Physics Simulation Designer.
Goal: Draft a hands-on physics lab guide and interactive simulation script for high school / college students.

Structure:
1. Lab Title & Learning Objectives (e.g., Pendulum Harmonic Motion or Photoelectric Effect).
2. Equipment & Digital Simulation Setup.
3. Step-by-Step Experimental Procedure with Data Recording Table.
4. STSE Context (How this concept powers modern solar panels or quantum computing).
5. Post-Lab Reflection Questions & Mathematical Analysis.`
  },
  {
    id: 'materials-opt',
    title: 'Materials AI Optimization for Aerospace Structures',
    category: 'Materials Science',
    description: 'Prompts AI models to evaluate high-temperature alloys and composite lattices for heat shield and engine nozzle design.',
    recommendedModel: 'Gemini 1.5 Pro',
    promptText: `### SYSTEM INSTRUCTION: Aerospace Materials Science Specialist
Role: Metallurgy & Composite Topology Engineer.
Goal: Evaluate materials for deep space hulls, cryogenic tanks, and hypersonic reentry.

Evaluation Framework:
1. Calculate Strength-to-Weight Ratio and Thermal Shock Resistance.
2. Compare candidate materials (Titanium Grade 5, Inconel 718, Carbon-Carbon, Graphene Aerogel).
3. Recommend AI-guided 3D printed lattice designs to minimize mass while preserving structural yield strength.
4. Output concise summary tables with melting points ($°C$), density ($g/cm^3$), and failure modes.`
  }
];

export const SciencePromptLibrary: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (prompt: SciencePrompt) => {
    sciFiAudio.playSuccess();
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              AI-Powered Scientific Notebooks & Prompt Library
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Production System Instructions & Astrodynamics Prompts for Google AI Studio
            </p>
          </div>
        </div>

        <a
          href="https://aistudio.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:bg-emerald-500/10 flex items-center gap-2 cursor-pointer"
        >
          <span>Launch AI Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Prompts Cards Grid */}
      <div className="space-y-4">
        {sciencePromptsList.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-white font-mono mt-1">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                    {item.recommendedModel}
                  </span>

                  <button
                    onClick={() => handleCopy(item)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'COPIED' : 'COPY PROMPT'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {item.description}
              </p>

              {/* Code Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {item.promptText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
