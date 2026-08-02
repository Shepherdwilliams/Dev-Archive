import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top-btn"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 p-3.5 sm:p-4 rounded-full bg-brand-black/90 hover:bg-brand-green text-brand-green hover:text-brand-black border-2 border-brand-green/60 hover:border-brand-green shadow-xl shadow-brand-green/20 backdrop-blur-md transition-all duration-300 cursor-pointer group active:scale-95 flex items-center gap-2"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-1" />
          <span className="hidden sm:inline font-mono font-bold text-xs uppercase tracking-wider pr-1">
            TOP
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
