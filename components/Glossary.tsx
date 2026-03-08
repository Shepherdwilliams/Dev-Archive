
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glossaryTerms } from '../constants';

export const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = useMemo(() => {
    // Sort terms alphabetically before filtering
    const sortedTerms = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
    if (!searchTerm) {
      return sortedTerms;
    }
    return sortedTerms.filter(term =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-4">AI Glossary</h1>
      <p className="text-lg text-brand-light-gray text-center mb-8">
        A searchable list of common terms and concepts in Artificial Intelligence.
      </p>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search for a term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 bg-brand-gray-dark border border-brand-border rounded-full text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-brand-light-gray">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredTerms.length > 0 ? (
              filteredTerms.map((term, index) => (
                  <motion.div 
                    key={term.term} 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="tech-card p-6 rounded-xl"
                  >
                    <h3 className="text-2xl font-bold text-brand-green mb-3">{term.term}</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-brand-light-gray font-semibold block mb-1">Definition</span>
                        <p className="text-white leading-relaxed">{term.definition}</p>
                      </div>
                      {term.example && (
                        <div className="pt-4 border-t border-brand-border/50">
                          <span className="text-xs uppercase tracking-wider text-brand-light-gray font-semibold block mb-1">Example</span>
                          <p className="text-brand-light-gray italic">"{term.example}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
              ))
          ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8 bg-brand-gray-dark rounded-lg"
              >
                  <p className="text-brand-light-gray">No terms found for "{searchTerm}".</p>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};