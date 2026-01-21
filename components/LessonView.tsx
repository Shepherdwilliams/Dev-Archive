
import React, { useState, useEffect } from 'react';
import type { Lesson, CourseModule } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  onMarkComplete: (lessonId: string) => void;
  allModules: CourseModule[];
  onSelectLesson: (lesson: Lesson) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onMarkComplete, allModules, onSelectLesson }) => {
  const findModuleIdForLesson = (lessonId: string): string | null => {
    for (const module of allModules) {
      if (module.lessons.some(l => l.id === lessonId)) {
        return module.id;
      }
    }
    return null;
  };

  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    const activeModuleId = findModuleIdForLesson(lesson.id);
    return activeModuleId ? new Set([activeModuleId]) : new Set();
  });

  useEffect(() => {
    const activeModuleId = findModuleIdForLesson(lesson.id);
    if (activeModuleId && !openModules.has(activeModuleId)) {
      setOpenModules(prevOpen => {
        const newOpen = new Set(prevOpen);
        newOpen.add(activeModuleId);
        return newOpen;
      });
    }
  }, [lesson.id, allModules]);

  const toggleAccordion = (moduleId: string) => {
    setOpenModules(prevOpen => {
      const newOpen = new Set(prevOpen);
      if (newOpen.has(moduleId)) {
        newOpen.delete(moduleId);
      } else {
        newOpen.add(moduleId);
      }
      return newOpen;
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // Bold text support: **text**
      const parts = paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // List support: - item
      if (paragraph.trim().startsWith('- ')) {
         return (
             <ul key={index} className="list-disc list-inside mb-4">
                 {paragraph.split('\n').map((item, itemIndex) => (
                     <li key={itemIndex} className="mb-1">{item.replace(/- /,'')}</li>
                 ))}
             </ul>
         );
      }
      
      if (paragraph.startsWith('```')) {
        const code = paragraph.replace(/```(javascript|python)?\n|```/g, '');
        return (
          <pre key={index} className="bg-brand-black rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm text-white">{code}</code>
          </pre>
        );
      }
      return (
        <p key={index} className="mb-4 text-brand-light-gray leading-relaxed">
          {parts}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 lg:flex-shrink-0">
        <div className="sticky top-24">
          <h3 className="text-xl font-bold text-white mb-4">Course Lessons</h3>
          <nav className="space-y-1">
            {allModules.map(module => {
              const isOpen = openModules.has(module.id);
              return (
                <div key={module.id}>
                  <button
                    onClick={() => toggleAccordion(module.id)}
                    className="w-full flex justify-between items-center text-left p-3 rounded-md hover:bg-brand-gray-dark/50 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-brand-green">{module.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-brand-light-gray transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="pl-3 mt-1 space-y-1">
                      {module.lessons.map(l => (
                        <button
                          key={l.id}
                          onClick={() => onSelectLesson(l)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                            lesson.id === l.id
                              ? 'bg-brand-green text-brand-black font-medium'
                              : 'text-brand-light-gray hover:bg-brand-border'
                          }`}
                        >
                          {l.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <article className="w-full lg:w-3/4 bg-brand-gray-dark p-6 sm:p-10 rounded-xl border border-brand-border">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{lesson.title}</h1>
        <div className="prose prose-invert max-w-none text-brand-light-gray">
            {renderContent(lesson.content)}
        </div>
        <div className="mt-10 border-t border-brand-border pt-6">
          <button
            onClick={() => onMarkComplete(lesson.id)}
            className="w-full md:w-auto bg-brand-green text-brand-black font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-green-dark transition-all duration-300 transform hover:scale-105"
          >
            Mark as Complete
          </button>
        </div>
      </article>
    </div>
  );
};