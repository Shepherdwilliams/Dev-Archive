
import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStartLearning: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning }) => {
  return (
    <section className="text-center py-20 md:py-32 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tighter glow-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Master <span className="text-brand-green">AI</span> in 30 Days
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-2xl text-brand-light-gray max-w-3xl mx-auto mb-10 font-light leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Your journey from beginner to practitioner starts here. Learn the fundamentals of Artificial Intelligence through our interactive, hands-on curriculum.
        </motion.p>
        
        <motion.button 
          onClick={onStartLearning}
          className="bg-brand-green text-brand-black font-bold py-4 px-10 rounded-full text-xl hover:bg-brand-green-dark transition-all duration-300 shadow-lg shadow-brand-green/20 relative group overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Start Learning Now</span>
          <motion.div 
            className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
            style={{ skewX: -20 }}
          />
        </motion.button>
      </motion.div>
    </section>
  );
};