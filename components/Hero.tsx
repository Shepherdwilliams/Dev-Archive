
import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStartLearning: () => void;
  onExploreAgents?: () => void;
  onInPersonServices?: () => void;
  onPlayIntro?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning, onExploreAgents, onInPersonServices, onPlayIntro }) => {
  return (
    <section className="relative py-16 md:py-28 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Background glow gradient accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-green/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-8"
      >
        {/* Monospaced Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2">
          <span className="mono-badge">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            01. OPEN ARCHIVE // AI & BOT ENGINE 2026
          </span>
        </div>

        {/* High Contrast Display Heading */}
        <motion.h1 
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight max-w-5xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Master <span className="text-brand-green glow-text">Artificial Intelligence</span> & Autonomous Agents.
        </motion.h1>

        {/* Crisp Sub-headline with generous spacing */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-brand-light-gray/90 max-w-3xl mx-auto font-normal leading-relaxed tracking-normal"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          An open, interactive curriculum bridging AI fundamentals, transformer architecture, prompt engineering, and production multi-agent automation systems.
        </motion.p>

        {/* Restrained Dual CTAs */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <motion.button 
            onClick={onStartLearning}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-brand-green text-brand-black font-extrabold px-8 py-4 rounded-full text-base sm:text-lg hover:bg-brand-green-dark transition-all duration-300 shadow-xl shadow-brand-green/20 flex items-center space-x-3 cursor-pointer"
          >
            <span>Start Learning Now</span>
            <span className="text-xl">→</span>
          </motion.button>

          {onInPersonServices && (
            <motion.button 
              onClick={onInPersonServices}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-green/10 hover:bg-brand-green/20 text-brand-green font-bold px-8 py-4 rounded-full text-base sm:text-lg border border-brand-green/40 transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-lg shadow-brand-green/10"
            >
              <span>💼 In-Person Services</span>
            </motion.button>
          )}

          {onExploreAgents && (
            <motion.button 
              onClick={onExploreAgents}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-gray-dark/60 hover:bg-brand-border/60 text-white font-semibold px-8 py-4 rounded-full text-base sm:text-lg border border-brand-border transition-all duration-300 flex items-center space-x-2 cursor-pointer"
            >
              <span>🤖 Try Autonomous Bots</span>
            </motion.button>
          )}
        </motion.div>

        {/* Minimalist Hairline Metrics Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="pt-12 mt-12 border-t border-brand-border/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto"
        >
          <div className="p-4 rounded-xl bg-brand-gray-dark/40 border border-brand-border/60">
            <div className="text-2xl font-black text-white font-mono">6 CORE</div>
            <div className="text-xs text-brand-light-gray font-medium uppercase tracking-wider mt-1">Interactive Modules</div>
          </div>
          <div className="p-4 rounded-xl bg-brand-gray-dark/40 border border-brand-border/60">
            <div className="text-2xl font-black text-brand-green font-mono">4 BOTS</div>
            <div className="text-xs text-brand-light-gray font-medium uppercase tracking-wider mt-1">Autonomous Agents</div>
          </div>
          <div className="p-4 rounded-xl bg-brand-gray-dark/40 border border-brand-border/60">
            <div className="text-2xl font-black text-white font-mono">3D ATOM</div>
            <div className="text-xs text-brand-light-gray font-medium uppercase tracking-wider mt-1">Science & Periodic Table</div>
          </div>
          <div className="p-4 rounded-xl bg-brand-gray-dark/40 border border-brand-border/60">
            <div className="text-2xl font-black text-brand-green font-mono">100% FREE</div>
            <div className="text-xs text-brand-light-gray font-medium uppercase tracking-wider mt-1">Open Development Archive</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
