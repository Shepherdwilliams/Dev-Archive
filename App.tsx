
import React, { useState, useEffect } from 'react';
import type { Models } from 'appwrite';
import { account, databases, APPWRITE_CONFIG } from './lib/appwrite';
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

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [view, setView] = useState<View>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Check for active session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
        await fetchProgress(user.$id);
      } catch (error) {
        // Not logged in
        console.log('No active session found.');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Save progress whenever it changes for the current user
  useEffect(() => {
    const saveProgress = async () => {
        if (currentUser && completedLessons.size > 0) {
            try {
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.userProgressCollectionId,
                    currentUser.$id,
                    { completedLessons: Array.from(completedLessons) }
                );
            } catch (error) {
                console.error('Failed to save progress:', error);
            }
        }
    };
    saveProgress();
  }, [completedLessons, currentUser]);

  const fetchProgress = async (userId: string) => {
    try {
      const document = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.userProgressCollectionId,
        userId
      );
      setCompletedLessons(new Set(document.completedLessons || []));
    } catch (error) {
      console.error('Could not fetch user progress:', error);
      // It might be a new user, so an empty set is fine.
      setCompletedLessons(new Set());
    }
  };
  
  const handleLoginSuccess = async (user: Models.User<Models.Preferences>) => {
    setCurrentUser(user);
    await fetchProgress(user.$id);
    setView('home'); // Go to home after login
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      setCompletedLessons(new Set());
      setView('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

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

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl text-brand-green">Loading...</p>
        </div>
    );
  }

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
