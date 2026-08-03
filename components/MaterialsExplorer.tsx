import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Thermometer, Layers, Zap, X, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

export interface MaterialData {
  id: string;
  name: string;
  formula: string;
  category: 'Aerospace Alloy' | 'High-Temp Composite' | 'Aero-Structure' | 'Optics & Thermal';
  thermalLimitC: number;
  strengthToWeight: number; // kN*m/kg
  densityGcm3: number;
  yieldStrengthMpa: number;
  applications: string[];
  aiOptimizationStory: string;
  chemicalStructure: string;
}

export const materialsDataset: MaterialData[] = [
  {
    id: 'ti-6al-4v',
    name: 'Titanium Alloy Ti-6Al-4V (Grade 5)',
    formula: 'Ti-6Al-4V',
    category: 'Aerospace Alloy',
    thermalLimitC: 400,
    strengthToWeight: 240,
    densityGcm3: 4.43,
    yieldStrengthMpa: 880,
    applications: ['Artemis Crew Capsule Frame', 'Falcon 9 Grid Fins', 'Rocket Thrust Vector Mounts'],
    aiOptimizationStory: 'Generative AI topology optimization algorithms reduce Ti-6Al-4V component weight by 38% while lattice-printing internal stress dissipation structures that prevent fatigue cracking under supersonic vibration.',
    chemicalStructure: 'Alpha-Beta Titanium Matrix with Aluminum (6%) and Vanadium (4%) stabilization.'
  },
  {
    id: 'carbon-carbon',
    name: 'Reinforced Carbon-Carbon (C/C)',
    formula: 'C / C Composite',
    category: 'High-Temp Composite',
    thermalLimitC: 1650,
    strengthToWeight: 310,
    densityGcm3: 1.85,
    yieldStrengthMpa: 700,
    applications: ['Orbiter Atmospheric Reentry Nose Cone', 'Hypersonic Wing Leading Edges', 'Rocket Nozzle Extensions'],
    aiOptimizationStory: 'Neural-network molecular dynamics models predict micro-fissure expansion during 3,000°F atmospheric plasma entry, optimizing 3D carbon fiber weave orientation for maximum ablation resistance.',
    chemicalStructure: 'Carbon fiber reinforcement embedded within a pyrolytic graphite matrix.'
  },
  {
    id: 'inconel-718',
    name: 'Inconel 718 Nickel Superalloy',
    formula: 'Ni-Cr-Fe-Nb-Mo',
    category: 'Aerospace Alloy',
    thermalLimitC: 700,
    strengthToWeight: 135,
    densityGcm3: 8.19,
    yieldStrengthMpa: 1100,
    applications: ['SpaceX Merlin 1D Rocket Injectors', 'Rutherford Engine Turbopumps', 'Combustion Chamber Liners'],
    aiOptimizationStory: 'Physics-informed machine learning models optimize selective laser melting (SLM) 3D printing parameters for Inconel 718, eliminating internal void porosity and extending engine fire lifetimes by 5x.',
    chemicalStructure: 'Austenitic nickel-chromium superalloy hardened by gamma-double-prime precipitation.'
  },
  {
    id: 'graphene-aerogel',
    name: 'Graphene Aerogel Insulator',
    formula: 'C_n (3D Nanoweb)',
    category: 'Optics & Thermal',
    thermalLimitC: 1200,
    strengthToWeight: 520,
    densityGcm3: 0.0016, // World lightest solid
    yieldStrengthMpa: 120,
    applications: ['Deep Space Cryogenic Tank Insulation', 'Micrometeorite Shielding Padding', 'Mars Rover Thermal Blankets'],
    aiOptimizationStory: 'Generative AI graph neural networks (GNNs) design custom 3D graphene pore geometries that trap gas molecules while maintaining extreme elasticity down to -270°C in interstellar space.',
    chemicalStructure: 'Ultra-porous crosslinked 3D network of single-atom-thick graphene sheets.'
  },
  {
    id: 'al-li-2195',
    name: 'Aluminum-Lithium Alloy 2195',
    formula: 'Al-Li-Cu-Zr',
    category: 'Aero-Structure',
    thermalLimitC: 150,
    strengthToWeight: 220,
    densityGcm3: 2.71,
    yieldStrengthMpa: 580,
    applications: ['SLS Core Stage Cryogenic Propellant Tanks', 'Space Shuttle External Tank', 'Falcon 9 Interstage'],
    aiOptimizationStory: 'AI acoustic emission monitoring during friction-stir welding predicts microscopic seam flaws in Al-Li 2195 tanks before liquid hydrogen (-253°C) pressure testing.',
    chemicalStructure: 'Lithium addition reduces density by 3% and increases elastic modulus by 6% per percent Li added.'
  },
  {
    id: 'sic-optics',
    name: 'Reaction-Bonded Silicon Carbide (SiC)',
    formula: 'SiC',
    category: 'Optics & Thermal',
    thermalLimitC: 1400,
    strengthToWeight: 190,
    densityGcm3: 3.10,
    yieldStrengthMpa: 450,
    applications: ['James Webb Optical Mirror Substrates', 'Gaia Space Telescope Mirrors', 'Laser Communication Optics'],
    aiOptimizationStory: 'Deep learning optical wavefront correction algorithms model cryogenic thermal distortion in SiC mirrors, enabling automated sub-nanometer laser polishing for deep space astronomy.',
    chemicalStructure: 'Covalent tetrahedral structure of carbon and silicon atoms bound in a rigid crystal lattice.'
  }
];

interface MaterialsExplorerProps {
  onAskAiAboutMaterial?: (materialName: string) => void;
}

export const MaterialsExplorer: React.FC<MaterialsExplorerProps> = ({ onAskAiAboutMaterial }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialData | null>(null);

  const handleSelect = (mat: MaterialData) => {
    sciFiAudio.playClick();
    setSelectedMaterial(mat);
  };

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              Materials Science & Aerospace AI Explorer
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              High-Strength Alloys, Thermal Barrier Composites & AI Topology Synthesis
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-400 font-bold bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl">
          6 Advanced Aerospace Datasets
        </span>
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materialsDataset.map((mat) => (
          <div
            key={mat.id}
            onClick={() => handleSelect(mat)}
            className="bg-slate-950 border border-slate-800 hover:border-purple-400/60 rounded-2xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-xl hover:shadow-purple-500/5 group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded uppercase">
                {mat.category}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {mat.formula}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                {mat.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono line-clamp-2 mt-1">
                {mat.applications.join(' • ')}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">
                Max Temp: <strong className="text-amber-400">{mat.thermalLimitC}°C</strong>
              </span>
              <span className="text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>INSPECT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal Popup */}
      <AnimatePresence>
        {selectedMaterial && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-800 pb-4 pr-10">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded">
                  {selectedMaterial.category} • {selectedMaterial.formula}
                </span>
                <h3 className="text-2xl font-black text-white font-mono mt-2">
                  {selectedMaterial.name}
                </h3>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">THERMAL LIMIT</span>
                  <span className="text-base font-black text-amber-400 mt-0.5 block">{selectedMaterial.thermalLimitC}°C</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">STRENGTH/WT RATIO</span>
                  <span className="text-base font-black text-purple-400 mt-0.5 block">{selectedMaterial.strengthToWeight}</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">DENSITY</span>
                  <span className="text-base font-black text-cyan-400 mt-0.5 block">{selectedMaterial.densityGcm3} g/cm³</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">YIELD STRENGTH</span>
                  <span className="text-base font-black text-emerald-400 mt-0.5 block">{selectedMaterial.yieldStrengthMpa} MPa</span>
                </div>
              </div>

              {/* Chemical Structure */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">MICROSTRUCTURE & METALLURGY:</span>
                <p className="text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedMaterial.chemicalStructure}
                </p>
              </div>

              {/* AI Optimization Story */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  HOW AI OPTIMIZES THIS MATERIAL FOR SPACE:
                </span>
                <p className="text-slate-200 bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl leading-relaxed">
                  {selectedMaterial.aiOptimizationStory}
                </p>
              </div>

              {/* Applications */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">PRIMARY SPACEFLIGHT USES:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.applications.map((app, idx) => (
                    <span key={idx} className="text-xs font-mono bg-slate-900 text-slate-300 px-3 py-1 rounded-lg border border-slate-800">
                      🚀 {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ask AI Action */}
              {onAskAiAboutMaterial && (
                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedMaterial(null);
                      onAskAiAboutMaterial(selectedMaterial.name);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Run AI Specialist Analysis for {selectedMaterial.name}</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
