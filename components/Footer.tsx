
import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-brand-black border-t border-brand-border mt-24 py-12 text-brand-light-gray"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-brand-border/60">
          
          {/* Left Brand Identity */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold tracking-tight text-lg">
              <div className="w-5 h-5 rounded bg-brand-green flex items-center justify-center text-brand-black font-mono text-xs font-black">
                Z
              </div>
              <span className="font-mono"><span className="text-brand-green">DEV</span>.ARCHIVE</span>
            </div>
            <p className="text-xs text-brand-light-gray/80 max-w-md">
              An open, interactive STEM & AI development curriculum by The Development Archive.
            </p>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-brand-gray-dark border border-brand-border text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
            </span>
            <span className="text-white font-semibold">ALL AGENTS & CHAT ENGINES OPERATIONAL</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-light-gray/60">
          <p>&copy; {new Date().getFullYear()} Development Archive (developmentarchive.net). All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a 
              href="mailto:support@developmentarchive.net" 
              className="text-slate-400 hover:text-brand-green transition-colors underline decoration-dotted"
            >
              support@developmentarchive.net
            </a>
            <span>•</span>
            <span className="text-brand-green">ZPERIOD.APP INTEGRATED</span>
            <span>•</span>
            <span>OPEN PEDAGOGY ENGINE</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
