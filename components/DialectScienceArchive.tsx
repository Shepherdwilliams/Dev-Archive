import React, { useState } from 'react';
import { Globe, Search, BookMarked, Sparkles, Languages, Lightbulb } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

export interface DialectTerm {
  id: string;
  standardTerm: string;
  category: 'Astronomy' | 'Physics' | 'Quantum' | 'Meteorology';
  regionalVariants: {
    dialectOrLanguage: string;
    indigenousOrNativeName: string;
    literalTranslation: string;
    region: string;
  }[];
  scientificDefinition: string;
  stseContext: string;
}

export const dialectTermsArchive: DialectTerm[] = [
  {
    id: 'aurora-borealis',
    standardTerm: 'Aurora Borealis (Northern Lights)',
    category: 'Astronomy',
    regionalVariants: [
      {
        dialectOrLanguage: 'Cree (Nehiyawewin)',
        indigenousOrNativeName: 'Wâwâtêw (𝑾â𝒘â𝒕ê𝒘)',
        literalTranslation: 'The Spirits Dancing in the Sky',
        region: 'Subarctic North America (Canada/US)'
      },
      {
        dialectOrLanguage: 'Japanese (Nihongo)',
        indigenousOrNativeName: 'Kyokukō (極光)',
        literalTranslation: 'Polar Light Curtain',
        region: 'East Asia'
      },
      {
        dialectOrLanguage: 'Sámi (Northern Sámi)',
        indigenousOrNativeName: 'Guovssahas',
        literalTranslation: 'The Light You Can Hear',
        region: 'Sápmi / Northern Scandinavia'
      }
    ],
    scientificDefinition: 'Atmospheric excitation caused by solar wind charged particles (electrons and protons) colliding with oxygen atoms at 100-300km altitude, producing green 557.7nm photon emissions.',
    stseContext: 'Cross-cultural oral traditions preserved centuries of solar cycle activity through auroral folklore long before magnetometer satellites mapped Earth’s magnetosphere.'
  },
  {
    id: 'supernova',
    standardTerm: 'Supernova Explosion',
    category: 'Astronomy',
    regionalVariants: [
      {
        dialectOrLanguage: 'Classical Chinese (Song Dynasty 1054 AD)',
        indigenousOrNativeName: 'Kè Xīng (客星)',
        literalTranslation: 'The Guest Star',
        region: 'China (Historical Records)'
      },
      {
        dialectOrLanguage: 'Arabic (Al-ʿArabīyah)',
        indigenousOrNativeName: 'Al-Kawkab al-Muta’alij (الكوكب المتأجج)',
        literalTranslation: 'The Blazing Celestial Body',
        region: 'Middle East / North Africa'
      }
    ],
    scientificDefinition: 'Cataclysmic core-collapse stellar death of stars exceeding 8 solar masses, synthesizing heavy elements (gold, platinum, uranium) via r-process nucleosynthesis.',
    stseContext: 'Astronomical logs recorded by Song Dynasty astronomers in 1054 AD allowed modern astrophysicists to pinpoint the origin date and expansion velocity of the Crab Nebula (M1).'
  },
  {
    id: 'milky-way',
    standardTerm: 'Milky Way Galaxy',
    category: 'Astronomy',
    regionalVariants: [
      {
        dialectOrLanguage: 'Sanskrit / Hindi',
        indigenousOrNativeName: 'Akasha Ganga (आकाशगंगा)',
        literalTranslation: 'The Heavenly River Ganges',
        region: 'South Asia'
      },
      {
        dialectOrLanguage: 'Māori (Te Reo Māori)',
        indigenousOrNativeName: 'Te Mangōroa',
        literalTranslation: 'The Great Celestial Shark',
        region: 'Aotearoa / New Zealand'
      },
      {
        dialectOrLanguage: 'Quechua (Inca Navigation)',
        indigenousOrNativeName: 'Mayu (Celestial River)',
        literalTranslation: 'The Dark Cloud Constellations in the Dust Belt',
        region: 'Andes / South America'
      }
    ],
    scientificDefinition: 'Barred spiral galaxy containing 100-400 billion stars spanning 100,000 light-years, with a supermassive black hole (Sagittarius A*) at its gravitational center.',
    stseContext: 'Incan astronomers navigated agricultural planting cycles using dark dust clouds (e.g. the Llama constellation) rather than bright stars alone.'
  },
  {
    id: 'quantum-entanglement',
    standardTerm: 'Quantum Entanglement',
    category: 'Quantum',
    regionalVariants: [
      {
        dialectOrLanguage: 'German (Deutsch)',
        indigenousOrNativeName: 'Spukhafte Fernwirkung',
        literalTranslation: 'Spooky Action at a Distance (Einstein, 1935)',
        region: 'Central Europe'
      },
      {
        dialectOrLanguage: 'Mandarin Chinese',
        indigenousOrNativeName: 'Liàngzǐ Chánráo (量子缠绕)',
        literalTranslation: 'Quantum Intertwining / Silk Entanglement',
        region: 'East Asia'
      }
    ],
    scientificDefinition: 'Non-local quantum correlation where the quantum state of two or more particles cannot be described independently, violating Bell’s inequality.',
    stseContext: 'EPR paradox terminology led to modern quantum cryptography (QKD) and satellite quantum communications networks like Micius.'
  },
  {
    id: 'tidal-force',
    standardTerm: 'Gravitational Tidal Force',
    category: 'Physics',
    regionalVariants: [
      {
        dialectOrLanguage: 'Hawaiian (ʻŌlelo Hawaiʻi)',
        indigenousOrNativeName: 'Ke Au Kai / Kai Mu Moku',
        literalTranslation: 'The Ocean Flowing Over the Reef',
        region: 'Polynesia / Pacific'
      },
      {
        dialectOrLanguage: 'Swahili (Kiswahili)',
        indigenousOrNativeName: 'Kupatwa kwa Maji ya Bahari',
        literalTranslation: 'The Tidal Pull of the Sea',
        region: 'East Africa Coast'
      }
    ],
    scientificDefinition: 'Differential gravitational force exerted on an extended body due to a non-uniform gravitational field gradient ($\frac{dF}{dr} \propto \frac{1}{r^3}$).',
    stseContext: 'Wayfinding navigators across Oceania predicted tidal resonance and submerged reef passes without instruments by reading gravitational swell harmonics.'
  }
];

export const DialectScienceArchive: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Astronomy', 'Physics', 'Quantum'];

  const filteredTerms = dialectTermsArchive.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.standardTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.regionalVariants.some(
        (v) =>
          v.dialectOrLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.indigenousOrNativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.literalTranslation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              Dialect & Regional Science Terminology Archive
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Cross-Cultural Astronomy, Indigenous Nomenclature & Science Translation
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
          Global Science Lexicon
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dialects, indigenous terms, or physics concepts..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-200 font-mono text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none placeholder:text-slate-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { sciFiAudio.playClick(); setSelectedCategory(cat); }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terminology Cards */}
      <div className="space-y-4">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  {term.category}
                </span>
                <h4 className="text-base font-bold text-white font-mono mt-1">
                  {term.standardTerm}
                </h4>
              </div>
            </div>

            {/* Regional Variants List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {term.regionalVariants.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1 font-mono"
                >
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    🌐 {v.dialectOrLanguage} ({v.region})
                  </span>
                  <div className="text-sm font-black text-amber-300">
                    {v.indigenousOrNativeName}
                  </div>
                  <div className="text-[11px] text-slate-300 italic">
                    "{v.literalTranslation}"
                  </div>
                </div>
              ))}
            </div>

            {/* Scientific Definition */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                🔬 SCIENTIFIC PHYSICS DEFINITION:
              </span>
              <p className="leading-relaxed">{term.scientificDefinition}</p>
            </div>

            {/* STSE Context */}
            <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 font-mono text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                STSE & HISTORICAL CULTURAL IMPACT:
              </span>
              <p className="leading-relaxed text-slate-200">{term.stseContext}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
