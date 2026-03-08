
import React from 'react';
import { motion } from 'framer-motion';
import type { Lesson } from '../types';
import { courseModules } from '../constants';

interface CourseModulesProps {
  onSelectLesson: (lesson: Lesson) => void;
  completedLessons: Set<string>;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


export const CourseModules: React.FC<CourseModulesProps> = ({ onSelectLesson, completedLessons }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="space-y-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="text-center mb-16">
        <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight glow-text">Course Modules</motion.h1>
        <motion.p variants={item} className="text-lg md:text-xl text-brand-light-gray max-w-2xl mx-auto leading-relaxed">
          Follow our structured path to build a strong foundation in Artificial Intelligence. Select a lesson to begin.
        </motion.p>
      </div>

      {courseModules.map((module, mIdx) => (
        <motion.div 
          key={module.id} 
          variants={item}
          className="tech-card p-6 sm:p-10 rounded-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-8xl font-black italic">0{mIdx + 1}</span>
          </div>
          
          <h2 className="text-3xl font-bold text-brand-green mb-4">{module.title}</h2>
          <p className="text-brand-light-gray mb-10 text-lg leading-relaxed max-w-3xl">{module.description}</p>
          
          <div className="grid grid-cols-1 gap-4">
            {module.lessons.map((lesson, lIdx) => (
              <motion.button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                whileHover={{ x: 10, backgroundColor: 'rgba(52, 58, 64, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between text-left p-5 rounded-xl bg-brand-gray-dark/40 border border-brand-border hover:border-brand-green/50 transition-all duration-300 group/lesson"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-brand-light-gray font-mono text-sm opacity-50">{lIdx + 1}.</span>
                  <span className="font-semibold text-white group-hover/lesson:text-brand-green transition-colors">{lesson.title}</span>
                </div>
                {completedLessons.has(lesson.id) ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckIcon className="w-7 h-7 text-brand-green" />
                  </motion.div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-brand-border group-hover/lesson:border-brand-green/30 transition-colors" />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
