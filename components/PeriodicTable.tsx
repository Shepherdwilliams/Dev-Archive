import React from 'react';
import { motion } from 'framer-motion';

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  category: string;
  xpos: number;
  ypos: number;
}

const elements: ElementData[] = [
  { number: 1, symbol: "H", name: "Hydrogen", category: "nonmetal", xpos: 1, ypos: 1 },
  { number: 2, symbol: "He", name: "Helium", category: "noble gas", xpos: 18, ypos: 1 },
  { number: 3, symbol: "Li", name: "Lithium", category: "alkali metal", xpos: 1, ypos: 2 },
  { number: 4, symbol: "Be", name: "Beryllium", category: "alkaline earth metal", xpos: 2, ypos: 2 },
  { number: 5, symbol: "B", name: "Boron", category: "metalloid", xpos: 13, ypos: 2 },
  { number: 6, symbol: "C", name: "Carbon", category: "nonmetal", xpos: 14, ypos: 2 },
  { number: 7, symbol: "N", name: "Nitrogen", category: "nonmetal", xpos: 15, ypos: 2 },
  { number: 8, symbol: "O", name: "Oxygen", category: "nonmetal", xpos: 16, ypos: 2 },
  { number: 9, symbol: "F", name: "Fluorine", category: "halogen", xpos: 17, ypos: 2 },
  { number: 10, symbol: "Ne", name: "Neon", category: "noble gas", xpos: 18, ypos: 2 },
  { number: 11, symbol: "Na", name: "Sodium", category: "alkali metal", xpos: 1, ypos: 3 },
  { number: 12, symbol: "Mg", name: "Magnesium", category: "alkaline earth metal", xpos: 2, ypos: 3 },
  { number: 13, symbol: "Al", name: "Aluminum", category: "post-transition metal", xpos: 13, ypos: 3 },
  { number: 14, symbol: "Si", name: "Silicon", category: "metalloid", xpos: 14, ypos: 3 },
  { number: 15, symbol: "P", name: "Phosphorus", category: "nonmetal", xpos: 15, ypos: 3 },
  { number: 16, symbol: "S", name: "Sulfur", category: "nonmetal", xpos: 16, ypos: 3 },
  { number: 17, symbol: "Cl", name: "Chlorine", category: "halogen", xpos: 17, ypos: 3 },
  { number: 18, symbol: "Ar", name: "Argon", category: "noble gas", xpos: 18, ypos: 3 },
  { number: 19, symbol: "K", name: "Potassium", category: "alkali metal", xpos: 1, ypos: 4 },
  { number: 20, symbol: "Ca", name: "Calcium", category: "alkaline earth metal", xpos: 2, ypos: 4 },
  { number: 21, symbol: "Sc", name: "Scandium", category: "transition metal", xpos: 3, ypos: 4 },
  { number: 22, symbol: "Ti", name: "Titanium", category: "transition metal", xpos: 4, ypos: 4 },
  { number: 23, symbol: "V", name: "Vanadium", category: "transition metal", xpos: 5, ypos: 4 },
  { number: 24, symbol: "Cr", name: "Chromium", category: "transition metal", xpos: 6, ypos: 4 },
  { number: 25, symbol: "Mn", name: "Manganese", category: "transition metal", xpos: 7, ypos: 4 },
  { number: 26, symbol: "Fe", name: "Iron", category: "transition metal", xpos: 8, ypos: 4 },
  { number: 27, symbol: "Co", name: "Cobalt", category: "transition metal", xpos: 9, ypos: 4 },
  { number: 28, symbol: "Ni", name: "Nickel", category: "transition metal", xpos: 10, ypos: 4 },
  { number: 29, symbol: "Cu", name: "Copper", category: "transition metal", xpos: 11, ypos: 4 },
  { number: 30, symbol: "Zn", name: "Zinc", category: "transition metal", xpos: 12, ypos: 4 },
  { number: 31, symbol: "Ga", name: "Gallium", category: "post-transition metal", xpos: 13, ypos: 4 },
  { number: 32, symbol: "Ge", name: "Germanium", category: "metalloid", xpos: 14, ypos: 4 },
  { number: 33, symbol: "As", name: "Arsenic", category: "metalloid", xpos: 15, ypos: 4 },
  { number: 34, symbol: "Se", name: "Selenium", category: "nonmetal", xpos: 16, ypos: 4 },
  { number: 35, symbol: "Br", name: "Bromine", category: "halogen", xpos: 17, ypos: 4 },
  { number: 36, symbol: "Kr", name: "Krypton", category: "noble gas", xpos: 18, ypos: 4 },
  { number: 37, symbol: "Rb", name: "Rubidium", category: "alkali metal", xpos: 1, ypos: 5 },
  { number: 38, symbol: "Sr", name: "Strontium", category: "alkaline earth metal", xpos: 2, ypos: 5 },
  { number: 39, symbol: "Y", name: "Yttrium", category: "transition metal", xpos: 3, ypos: 5 },
  { number: 40, symbol: "Zr", name: "Zirconium", category: "transition metal", xpos: 4, ypos: 5 },
  { number: 41, symbol: "Nb", name: "Niobium", category: "transition metal", xpos: 5, ypos: 5 },
  { number: 42, symbol: "Mo", name: "Molybdenum", category: "transition metal", xpos: 6, ypos: 5 },
  { number: 43, symbol: "Tc", name: "Technetium", category: "transition metal", xpos: 7, ypos: 5 },
  { number: 44, symbol: "Ru", name: "Ruthenium", category: "transition metal", xpos: 8, ypos: 5 },
  { number: 45, symbol: "Rh", name: "Rhodium", category: "transition metal", xpos: 9, ypos: 5 },
  { number: 46, symbol: "Pd", name: "Pallium", category: "transition metal", xpos: 10, ypos: 5 },
  { number: 47, symbol: "Ag", name: "Silver", category: "transition metal", xpos: 11, ypos: 5 },
  { number: 48, symbol: "Cd", name: "Cadmium", category: "transition metal", xpos: 12, ypos: 5 },
  { number: 49, symbol: "In", name: "Indium", category: "post-transition metal", xpos: 13, ypos: 5 },
  { number: 50, symbol: "Sn", name: "Tin", category: "post-transition metal", xpos: 14, ypos: 5 },
  { number: 51, symbol: "Sb", name: "Antimony", category: "metalloid", xpos: 15, ypos: 5 },
  { number: 52, symbol: "Te", name: "Tellurium", category: "metalloid", xpos: 16, ypos: 5 },
  { number: 53, symbol: "I", name: "Iodine", category: "halogen", xpos: 17, ypos: 5 },
  { number: 54, symbol: "Xe", name: "Xenon", category: "noble gas", xpos: 18, ypos: 5 },
  // Period 6
  { number: 55, symbol: "Cs", name: "Cesium", category: "alkali metal", xpos: 1, ypos: 6 },
  { number: 56, symbol: "Ba", name: "Barium", category: "alkaline earth metal", xpos: 2, ypos: 6 },
  { number: 57, symbol: "La", name: "Lanthanum", category: "lanthanide", xpos: 3, ypos: 6 },
  { number: 72, symbol: "Hf", name: "Hafnium", category: "transition metal", xpos: 4, ypos: 6 },
  { number: 73, symbol: "Ta", name: "Tantalum", category: "transition metal", xpos: 5, ypos: 6 },
  { number: 74, symbol: "W", name: "Tungsten", category: "transition metal", xpos: 6, ypos: 6 },
  { number: 75, symbol: "Re", name: "Rhenium", category: "transition metal", xpos: 7, ypos: 6 },
  { number: 76, symbol: "Os", name: "Osmium", category: "transition metal", xpos: 8, ypos: 6 },
  { number: 77, symbol: "Ir", name: "Iridium", category: "transition metal", xpos: 9, ypos: 6 },
  { number: 78, symbol: "Pt", name: "Platinum", category: "transition metal", xpos: 10, ypos: 6 },
  { number: 79, symbol: "Au", name: "Gold", category: "transition metal", xpos: 11, ypos: 6 },
  { number: 80, symbol: "Hg", name: "Mercury", category: "transition metal", xpos: 12, ypos: 6 },
  { number: 81, symbol: "Tl", name: "Thallium", category: "post-transition metal", xpos: 13, ypos: 6 },
  { number: 82, symbol: "Pb", name: "Lead", category: "post-transition metal", xpos: 14, ypos: 6 },
  { number: 83, symbol: "Bi", name: "Bismuth", category: "post-transition metal", xpos: 15, ypos: 6 },
  { number: 84, symbol: "Po", name: "Polonium", category: "post-transition metal", xpos: 16, ypos: 6 },
  { number: 85, symbol: "At", name: "Astatine", category: "metalloid", xpos: 17, ypos: 6 },
  { number: 86, symbol: "Rn", name: "Radon", category: "noble gas", xpos: 18, ypos: 6 },
  // Period 7
  { number: 87, symbol: "Fr", name: "Francium", category: "alkali metal", xpos: 1, ypos: 7 },
  { number: 88, symbol: "Ra", name: "Radium", category: "alkaline earth metal", xpos: 2, ypos: 7 },
  { number: 89, symbol: "Ac", name: "Actinium", category: "actinide", xpos: 3, ypos: 7 },
  { number: 104, symbol: "Rf", name: "Rutherfordium", category: "transition metal", xpos: 4, ypos: 7 },
  { number: 112, symbol: "Cn", name: "Copernicium", category: "transition metal", xpos: 12, ypos: 7 },
  { number: 118, symbol: "Og", name: "Oganesson", category: "noble gas", xpos: 18, ypos: 7 },
];

const categoryColors: Record<string, string> = {
  "nonmetal": "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
  "noble gas": "bg-purple-500/20 border-purple-500/40 text-purple-400",
  "alkali metal": "bg-red-500/20 border-red-500/40 text-red-400",
  "alkaline earth metal": "bg-orange-500/20 border-orange-500/40 text-orange-400",
  "metalloid": "bg-teal-500/20 border-teal-500/40 text-teal-400",
  "halogen": "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
  "transition metal": "bg-blue-500/20 border-blue-500/40 text-blue-400",
  "post-transition metal": "bg-gray-500/20 border-gray-500/40 text-gray-400",
  "lanthanide": "bg-pink-500/20 border-pink-500/40 text-pink-400",
  "actinide": "bg-rose-500/20 border-rose-500/40 text-rose-400",
};

interface TooltipProps {
    element: ElementData;
}

export const PeriodicTable: React.FC<{
  onSelectElement: (symbol: string) => void;
}> = ({ onSelectElement }) => {
  return (
    <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-brand-border">
      <div 
        className="grid gap-1 min-w-[800px]" 
        style={{ 
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(7, minmax(0, 1fr))'
        }}
      >
        {elements.map((el) => (
          <motion.button
            key={el.number}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectElement(el.symbol)}
            className={`p-1 flex flex-col items-center justify-center border rounded transition-all group relative h-12 ${categoryColors[el.category] || 'bg-brand-border border-brand-border'}`}
            style={{
              gridColumnStart: el.xpos,
              gridRowStart: el.ypos,
            }}
          >
            <span className="text-[8px] font-mono opacity-60 absolute top-0.5 left-1">{el.number}</span>
            <span className="text-sm font-bold">{el.symbol}</span>
            <span className="text-[6px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
              {el.name}
            </span>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-current opacity-0 blur-lg group-hover:opacity-10 transition-opacity" />
          </motion.button>
        ))}
      </div>
      
      <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
            {Object.keys(categoryColors).map(cat => (
                <div key={cat} className="flex items-center gap-2 text-[10px] font-mono text-brand-light-gray uppercase tracking-widest">
                    <div className={`w-3 h-3 rounded ${categoryColors[cat].split(' ')[0]}`}></div>
                    {cat}
                </div>
            ))}
      </div>
    </div>
  );
};
