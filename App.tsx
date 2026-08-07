import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CurriculumGrid } from './components/CurriculumGrid';
import { CourseModules } from './components/CourseModules';
import { LessonView } from './components/LessonView';
import { Quiz } from './components/Quiz';
import { Glossary } from './components/Glossary';
import { Chat } from './components/Chat';
import { ScienceLab } from './components/ScienceLab';
import { BotsAndAgents } from './components/BotsAndAgents';
import { Services } from './components/Services';
import { Store } from './components/Store';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { VideoIntro } from './components/VideoIntro';
import { ScrollToTop } from './components/ScrollToTop';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { AuthModal } from './components/AuthModal';
import { ResumeBanner } from './components/ResumeBanner';
import type { Lesson, UserProfile, UserProgressState } from './types';
import { courseModules } from './constants';
import {
  auth,
  onAuthStateChanged,
  fetchUserProgress,
  saveUserProgress,
  syncUserProfile,
  User
} from './src/firebase';

export type View = 'home' | 'modules' | 'lesson' | 'agents' | 'services' | 'quiz' | 'glossary' | 'chat' | 'science' | 'store' | 'contact';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Firebase Auth & Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedProgressState, setSavedProgressState] = useState<UserProgressState | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Video Intro state - plays on page load
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Retro Sci-Fi Canvas Starfield FX toggle
  const [starfieldEnabled, setStarfieldEnabled] = useState<boolean>(true);

  const totalLessons = courseModules.reduce((acc, module) => acc + module.lessons.length, 0);

  const handleFinishIntro = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Helper to find a lesson by ID
  const findLessonById = (lessonId: string): Lesson | null => {
    for (const mod of courseModules) {
      const match = mod.lessons.find(l => l.id === lessonId);
      if (match) return match;
    }
    return null;
  };

  // Listen for Auth state changes and sync Firestore profile & progress
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await syncUserProfile(user);
          setUserProfile(profile);

          // Fetch cloud progress from Firestore
          const remoteProgress = await fetchUserProgress(user.uid);
          if (remoteProgress) {
            setSavedProgressState(remoteProgress);
            if (remoteProgress.completedLessonIds && Array.isArray(remoteProgress.completedLessonIds)) {
              setCompletedLessons(new Set(remoteProgress.completedLessonIds));
            }
          } else {
            // First time progress creation
            const initialProgress: UserProgressState = {
              userId: user.uid,
              lastCompletedStepId: '',
              completionPercentage: 0,
              completedLessonIds: Array.from(completedLessons),
              completedQuizIds: [],
              updatedAt: new Date().toISOString()
            };
            await saveUserProgress(initialProgress);
            setSavedProgressState(initialProgress);
          }
        } catch (e) {
          console.error("Error syncing profile & progress on auth change:", e);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setSavedProgressState(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fallback local storage state loading when not logged in
  useEffect(() => {
    if (!currentUser) {
      try {
        const storedProgress = localStorage.getItem('devArchiveProgress');
        if (storedProgress) {
          setCompletedLessons(new Set(JSON.parse(storedProgress)));
        }
      } catch (error) {
        console.error("Failed to load progress from localStorage", error);
        setCompletedLessons(new Set());
      }
    }
  }, [currentUser]);

  // Save progress locally and to Firestore whenever completedLessons or activeLesson changes
  const autoSaveProgress = useCallback(
    async (lessonIdJustCompleted?: string) => {
      const lessonArray = Array.from(completedLessons);
      if (lessonIdJustCompleted && !completedLessons.has(lessonIdJustCompleted)) {
        lessonArray.push(lessonIdJustCompleted);
      }

      const calcPct = totalLessons > 0 ? Math.round((lessonArray.length / totalLessons) * 100) : 0;
      const lastStep = lessonIdJustCompleted || activeLesson?.id || lessonArray[lessonArray.length - 1] || '';

      // Save to LocalStorage
      try {
        localStorage.setItem('devArchiveProgress', JSON.stringify(lessonArray));
      } catch (e) {
        console.error("Local storage write error:", e);
      }

      // Save to Firestore if authenticated
      if (currentUser) {
        const progressPayload: UserProgressState = {
          userId: currentUser.uid,
          lastCompletedStepId: lastStep,
          completionPercentage: calcPct,
          completedLessonIds: lessonArray,
          completedQuizIds: savedProgressState?.completedQuizIds || [],
          updatedAt: new Date().toISOString()
        };
        await saveUserProgress(progressPayload);
        setSavedProgressState(progressPayload);
      }
    },
    [completedLessons, totalLessons, activeLesson, currentUser, savedProgressState]
  );

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setView('lesson');
    if (currentUser) {
      autoSaveProgress();
    }
  };

  const handleMarkComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });
    autoSaveProgress(lessonId);
    setView('modules');
  };

  const handleResumeProgress = (stepId: string) => {
    const matchedLesson = findLessonById(stepId);
    if (matchedLesson) {
      setActiveLesson(matchedLesson);
      setView('lesson');
    } else {
      setView('modules');
    }
  };

  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, activeLesson]);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={view + (activeLesson?.id || '')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {(() => {
            switch (view) {
              case 'modules':
                return <CourseModules onSelectLesson={handleSelectLesson} completedLessons={completedLessons} />;
              case 'agents':
                return <BotsAndAgents />;
              case 'services':
                return <Services />;
              case 'lesson':
                return activeLesson && <LessonView lesson={activeLesson} onMarkComplete={handleMarkComplete} allModules={courseModules} onSelectLesson={handleSelectLesson}/>;
              case 'quiz':
                return <Quiz />;
              case 'glossary':
                return <Glossary />;
              case 'chat':
                return <Chat />;
              case 'science':
                return <ScienceLab />;
              case 'store':
                return <Store />;
              case 'contact':
                return <Contact />;
              case 'home':
              default:
                return (
                  <>
                    <Hero 
                      onStartLearning={() => setView('modules')} 
                      onInPersonServices={() => setView('services')}
                      onExploreAgents={() => setView('agents')}
                      onPlayIntro={handleReplayIntro}
                    />
                    <CurriculumGrid />
                  </>
                );
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Retro Starfield Particle Canvas */}
      <StarfieldCanvas enabled={starfieldEnabled} />

      {showIntro && <VideoIntro onComplete={handleFinishIntro} />}
      
      {/* Auth Modal Component */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        userProfile={userProfile}
      />

      {/* Main site content wrapper - hidden on first frame while intro plays to avoid flash of content */}
      <div 
        className={`min-h-screen flex flex-col font-sans relative overflow-hidden bg-brand-black transition-opacity duration-700 ease-out ${
          showIntro ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <div className="scanline" />
        <Header 
          setView={setView} 
          currentView={view} 
          onReplayIntro={handleReplayIntro} 
          starfieldEnabled={starfieldEnabled}
          setStarfieldEnabled={setStarfieldEnabled}
          currentUser={currentUser}
          userProfile={userProfile}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          
          {/* Resume Banner when progress is available */}
          <ResumeBanner
            progress={savedProgressState}
            onResume={handleResumeProgress}
          />

          {view === 'modules' && (
            <div className="mb-8 p-4 bg-brand-gray-dark rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">Your Progress</h2>
                {currentUser ? (
                  <span className="text-xs text-brand-green font-mono font-bold bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded">
                    ☁️ Cloud Synced
                  </span>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-xs text-slate-400 hover:text-brand-green font-mono underline cursor-pointer"
                  >
                    Sign in to save progress to cloud
                  </button>
                )}
              </div>
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
        <ScrollToTop />
      </div>
    </div>
  );
};

export default App;

