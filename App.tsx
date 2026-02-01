
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CurriculumGrid } from './components/CurriculumGrid';
import { CourseModules } from './components/CourseModules';
import { LessonView } from './components/LessonView';
import { Quiz } from './components/Quiz';
import { Glossary } from './components/Glossary';
import { Chat } from './components/Chat';
import { Store } from './components/Store';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import type { Lesson, CourseModule } from './types';
import { courseModules } from './constants';

export type View = 'home' | 'modules' | 'lesson' | 'quiz' | 'glossary' | 'chat' | 'store' | 'contact';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Load progress from localStorage on initial render
  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem('devArchiveProgress');
      if (storedProgress) {
        setCompletedLessons(new Set(JSON.parse(storedProgress)));
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
      setCompletedLessons(new Set());
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('devArchiveProgress', JSON.stringify(Array.from(completedLessons)));
    } catch (error) {
      console.error("Failed to save progress to localStorage", error);
    }
  }, [completedLessons]);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setView('lesson');
  };

  const handleMarkComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    setView('modules');
  };

  const totalLessons = courseModules.reduce((acc, module) => acc + module.lessons.length, 0);
  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, activeLesson]);

  const renderContent = () => {
    switch (view) {
      case 'modules':
        return <CourseModules onSelectLesson={handleSelectLesson} completedLessons={completedLessons} />;
      case 'lesson':
        return activeLesson && <LessonView lesson={activeLesson} onMarkComplete={handleMarkComplete} allModules={courseModules} onSelectLesson={handleSelectLesson}/>;
      case 'quiz':
        return <Quiz />;
      case 'glossary':
        return <Glossary />;
      case 'chat':
        return <Chat />;
      case 'store':
        return <Store />;
      case 'contact':
        return <Contact />;
      case 'home':
      default:
        return (
          <>
            <Hero onStartLearning={() => setView('modules')} />
            <CurriculumGrid />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header setView={setView} currentView={view} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
         {view === 'modules' && (
          <div className="mb-8 p-4 bg-brand-gray-dark rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">Your Progress</h2>
            <div className="w-full bg-brand-border rounded-full h-4">
              <div 
                className="bg-brand-green h-4 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm mt-1 text-brand-green">{Math.round(progress)}% Complete</p>
          </div>
        )}
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
