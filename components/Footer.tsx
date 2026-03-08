
import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-brand-black border-t border-brand-border mt-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-brand-light-gray">
        <p className="text-lg font-semibold text-white mb-2 tracking-wider">
          <span className="text-brand-green">Dev</span> Archive
        </p>
        <p>&copy; {new Date().getFullYear()} Development Archive. All rights reserved.</p>
        <p className="text-sm mt-2 opacity-60">Empowering the next generation of AI innovators.</p>
      </div>
    </motion.footer>
  );
};