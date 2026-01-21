
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black border-t border-brand-border mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-brand-light-gray">
        <p>&copy; {new Date().getFullYear()} Development Archive. All rights reserved.</p>
        <p className="text-sm mt-1">Empowering the next generation of AI innovators.</p>
      </div>
    </footer>
  );
};