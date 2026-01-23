
import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/appwrite';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CurriculumGrid } from './components/CurriculumGrid';
import { CourseModules } from './components/CourseModules';
import { LessonView } from './components/LessonView';
import { Quiz } from './components/Quiz';
import { Glossary } from './components/Glossary';
import { Chat } from './components/Chat';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import { SupabaseSetupGuide } from './components/SetupGuide';
import type { Lesson, CourseModule } from './types';
import { courseModules } from './constants';

export type View = 'home' | 'modules' | 'lesson' | 'quiz' | 'glossary' | 'chat';

const App: React.FC = () => {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupGuide />;
  }

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setCurrentUser(user);

        if (event === 'SIGNED_IN') {
          await fetchProgress(user.id);
        }
        
        if (event === 'SIGNED_OUT') {
            setCompletedLessons(new Set());
        }

        setIsLoading(false);
      }
    );

    // Initial session check
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setCurrentUser(session.user);
            await fetchProgress(session.user.id);
        }
        setIsLoading(false);
    };
    checkInitialSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      if (currentUser && completedLessons.size > 0) {
        const { error } = await supabase.from('user_progress').upsert({
          user_id: currentUser.id,
          completed_lessons: Array.from(completedLessons),
        });
        if (error) {
          console.error('Failed to save progress:', error);
        }
      }
    };
    // Only save progress if there is a user
    if (currentUser) {
        saveProgress();
    }
  }, [completedLessons, currentUser]);

  const fetchProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('completed_lessons')
      .eq('user_id', userId)
      .single();
      
    if (data && data.completed_lessons) {
      setCompletedLessons(new Set(data.completed_lessons));
    } else if (error && error.code !== 'PGRST116') { // Ignore 'range not found' for new users
      console.error('Could not fetch user progress:', error);
      setCompletedLessons(new Set());
    } else {
      setCompletedLessons(new Set());
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
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
      case 'chat':
        return <Chat />;
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
        <Auth />
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