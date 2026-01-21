
import React, { useState, useMemo } from 'react';
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

      <div className="space-y-4">
        {filteredTerms.length > 0 ? (
            filteredTerms.map(term => (
                <div key={term.term} className="bg-brand-gray-dark/50 p-6 rounded-lg border border-brand-border">
                <h3 className="text-xl font-bold text-brand-green">{term.term}</h3>
                <p className="text-brand-light-gray mt-2">{term.definition}</p>
                </div>
            ))
        ) : (
            <div className="text-center p-8 bg-brand-gray-dark rounded-lg">
                <p className="text-brand-light-gray">No terms found for "{searchTerm}".</p>
            </div>
        )}
      </div>
    </div>
  );
};