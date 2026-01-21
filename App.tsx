
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CurriculumGrid } from './components/CurriculumGrid';
import { CourseModules } from './components/CourseModules';
import { LessonView } from './components/LessonView';
import { Quiz } from './components/Quiz';
import { Glossary } from './components/Glossary';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import type { Lesson, CourseModule } from './types';
import { courseModules } from './constants';

export type View = 'home' | 'modules' | 'lesson' | 'quiz' | 'glossary';

// Helper functions for localStorage
const getProgressForUser = (email: string): Set<string> => {
  const allProgress = JSON.parse(localStorage.getItem('dev-archive-progress') || '{}');
  return new Set(allProgress[email] || []);
};

const saveProgressForUser = (email: string, progress: Set<string>) => {
  const allProgress = JSON.parse(localStorage.getItem('dev-archive-progress') || '{}');
  allProgress[email] = Array.from(progress);
  localStorage.setItem('dev-archive-progress', JSON.stringify(allProgress));
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [view, setView] = useState<View>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Check for active session on initial load
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('dev-archive-user');
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
      setCompletedLessons(getProgressForUser(loggedInUser));
    }
  }, []);

  // Save progress whenever it changes for the current user
  useEffect(() => {
    if (currentUser) {
      saveProgressForUser(currentUser, completedLessons);
    }
  }, [completedLessons, currentUser]);


  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
    sessionStorage.setItem('dev-archive-user', email);
    setCompletedLessons(getProgressForUser(email));
    setView('home'); // Go to home after login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('dev-archive-user');
    setCompletedLessons(new Set());
    setView('home');
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setView('lesson');
  };

  const handleMarkComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    setView('modules');
  };

  const totalLessons = courseModules.reduce((acc, module) => acc + module.lessons.length, 0);
  const progress = (completedLessons.size / totalLessons) * 100;


  useEffect(() => {
    if (currentUser) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view, activeLesson, currentUser]);


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

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans p-4">
        <Auth onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header setView={setView} currentView={view} currentUser={currentUser} onLogout={handleLogout} />
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