
import React from 'react';
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
  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold text-center text-white mb-4">Course Modules</h1>
      <p className="text-lg text-brand-light-gray text-center max-w-2xl mx-auto">
        Follow our structured path to build a strong foundation in Artificial Intelligence. Select a lesson to begin.
      </p>

      {courseModules.map(module => (
        <div key={module.id} className="bg-brand-gray-dark/50 p-6 sm:p-8 rounded-xl border border-brand-border">
          <h2 className="text-2xl font-bold text-brand-green mb-2">{module.title}</h2>
          <p className="text-brand-light-gray mb-6">{module.description}</p>
          <div className="space-y-4">
            {module.lessons.map(lesson => (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className="w-full flex items-center justify-between text-left p-4 rounded-lg bg-brand-gray-dark hover:bg-brand-border transition-colors duration-200 ring-1 ring-brand-border hover:ring-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                <span className="font-medium text-white">{lesson.title}</span>
                {completedLessons.has(lesson.id) && <CheckIcon className="w-6 h-6 text-brand-green" />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};