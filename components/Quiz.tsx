
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions } from '../constants';
import { LeaderboardEntry } from '../types';

const LEADERBOARD_STORAGE_KEY = 'devarchive_quiz_leaderboard';

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'Dr. Ada Lovelace', score: quizQuestions.length, total: quizQuestions.length, percentage: 100, date: '2026-07-28' },
  { id: 'lb-2', name: 'Alan Turing', score: quizQuestions.length, total: quizQuestions.length, percentage: 100, date: '2026-07-29' },
  { id: 'lb-3', name: 'Claude Shannon', score: Math.max(1, quizQuestions.length - 1), total: quizQuestions.length, percentage: Math.round(((quizQuestions.length - 1) / quizQuestions.length) * 100), date: '2026-07-30' },
  { id: 'lb-4', name: 'Grace Hopper', score: Math.max(1, quizQuestions.length - 1), total: quizQuestions.length, percentage: Math.round(((quizQuestions.length - 1) / quizQuestions.length) * 100), date: '2026-08-01' },
];

export const Quiz: React.FC = () => {
  const [activeView, setActiveView] = useState<'quiz' | 'leaderboard'>('quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeaderboard(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse leaderboard from localStorage:', e);
    }
    // Default fallback if empty
    setLeaderboard(DEFAULT_LEADERBOARD);
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
  }, []);

  // Save leaderboard to localStorage whenever updated
  const saveLeaderboard = (updated: LeaderboardEntry[]) => {
    setLeaderboard(updated);
    try {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save leaderboard to localStorage:', e);
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
    setHasSubmitted(false);
    setSubmittedId(null);
    setPlayerName('');
    setActiveView('quiz');
  };

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSubmitted) return;

    const nameToUse = playerName.trim() || 'Anonymous Learner';
    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const today = new Date().toISOString().split('T')[0];
    const newEntryId = `entry-${Date.now()}`;

    const newEntry: LeaderboardEntry = {
      id: newEntryId,
      name: nameToUse,
      score,
      total,
      percentage,
      date: today,
    };

    // Sort leaderboard by score descending, then percentage descending
    const updated = [...leaderboard, newEntry].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.percentage - a.percentage;
    });

    saveLeaderboard(updated);
    setHasSubmitted(true);
    setSubmittedId(newEntryId);
  };

  const handleResetLeaderboard = () => {
    if (window.confirm('Are you sure you want to reset the leaderboard to default scores?')) {
      saveLeaderboard(DEFAULT_LEADERBOARD);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header & Sub-Navigation */}
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight glow-text"
        >
          Test Your Knowledge
        </motion.h1>

        {/* Tab Toggle */}
        <div className="inline-flex p-1.5 bg-brand-gray-dark/80 rounded-2xl border border-brand-border">
          <button
            onClick={() => setActiveView('quiz')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center space-x-2 ${
              activeView === 'quiz'
                ? 'bg-brand-green text-brand-black shadow-lg'
                : 'text-brand-light-gray hover:text-white hover:bg-brand-border/40'
            }`}
          >
            <span>🎯 Quiz Engine</span>
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center space-x-2 ${
              activeView === 'leaderboard'
                ? 'bg-brand-green text-brand-black shadow-lg'
                : 'text-brand-light-gray hover:text-white hover:bg-brand-border/40'
            }`}
          >
            <span>🏆 Local Leaderboard</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeView === 'leaderboard' ? 'bg-brand-black/20 text-brand-black' : 'bg-brand-black text-brand-green border border-brand-green/30'
            }`}>
              {leaderboard.length}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LEADERBOARD VIEW */}
      {activeView === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="tech-card p-6 sm:p-8 rounded-2xl border border-brand-border space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>🏆 Hall of Fame</span>
                <span className="text-xs font-mono bg-brand-green/10 text-brand-green px-2.5 py-1 rounded border border-brand-green/30">
                  LOCAL PERSISTENT
                </span>
              </h2>
              <p className="text-xs text-brand-light-gray mt-1">High scores saved directly to your browser's local storage.</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setActiveView('quiz');
                  if (quizFinished) handleRestart();
                }}
                className="bg-brand-green text-brand-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-brand-green-dark transition-colors"
              >
                🎮 {quizFinished ? 'Retake Quiz' : 'Start Quiz'}
              </button>
              <button
                onClick={handleResetLeaderboard}
                className="bg-brand-black/50 hover:bg-red-500/20 text-brand-light-gray hover:text-red-400 border border-brand-border hover:border-red-500/40 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                title="Reset local scores to defaults"
              >
                Reset Scores
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-brand-border text-brand-light-gray text-xs uppercase tracking-wider">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Learner</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3 text-center">Accuracy</th>
                  <th className="py-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {leaderboard.map((entry, idx) => {
                  const isUserSubmission = entry.id === submittedId;
                  let rankBadge = `${idx + 1}`;
                  let rankStyle = 'text-brand-light-gray';

                  if (idx === 0) {
                    rankBadge = '🥇 1st';
                    rankStyle = 'text-yellow-400 font-extrabold';
                  } else if (idx === 1) {
                    rankBadge = '🥈 2nd';
                    rankStyle = 'text-gray-300 font-extrabold';
                  } else if (idx === 2) {
                    rankBadge = '🥉 3rd';
                    rankStyle = 'text-amber-600 font-extrabold';
                  }

                  return (
                    <motion.tr
                      key={entry.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`transition-colors ${
                        isUserSubmission 
                          ? 'bg-brand-green/15 font-bold text-white border-l-4 border-l-brand-green' 
                          : 'hover:bg-brand-black/40 text-gray-200'
                      }`}
                    >
                      <td className={`py-3.5 px-3 font-mono ${rankStyle}`}>
                        {rankBadge}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{entry.name}</span>
                          {isUserSubmission && (
                            <span className="text-[10px] bg-brand-green text-brand-black font-bold px-1.5 py-0.5 rounded">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-brand-green">
                        {entry.score} / {entry.total}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-brand-border rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className="h-full bg-brand-green" 
                              style={{ width: `${entry.percentage}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs">{entry.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-xs text-brand-light-gray">
                        {entry.date}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* VIEW 2: QUIZ FINISHED SUMMARY & SCORE SUBMISSION */}
      {activeView === 'quiz' && quizFinished && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center tech-card p-8 sm:p-12 rounded-2xl max-w-2xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-bold uppercase tracking-wider">
            🎉 Quiz Completed
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Results</h2>
            <div className="text-6xl font-black text-brand-green tracking-tight my-4">
              {score} / {quizQuestions.length}
            </div>
            <p className="text-lg text-brand-light-gray">
              {score === quizQuestions.length ? "Perfect score! You're an AI master." : "Great effort! Keep reviewing the modules to master the concepts."}
            </p>
          </div>

          {/* Form to submit score to local persistent leaderboard */}
          <div className="bg-brand-black/60 p-6 rounded-2xl border border-brand-border text-left space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>🏆 Save to Local Leaderboard</span>
              <span className="text-xs font-mono text-brand-green">localStorage</span>
            </h3>

            {!hasSubmitted ? (
              <form onSubmit={handleSubmitScore} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-light-gray mb-1.5">
                    Enter Your Name / Identifier:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    placeholder="e.g. AI Explorer"
                    className="w-full bg-brand-gray-dark text-white p-3 rounded-xl border border-brand-border focus:border-brand-green focus:outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-green text-brand-black font-bold py-3 px-6 rounded-xl text-sm hover:bg-brand-green-dark transition-all duration-200 shadow-md shadow-brand-green/20"
                >
                  Save My Score to Leaderboard
                </button>
              </form>
            ) : (
              <div className="p-4 bg-brand-green/15 border border-brand-green/40 rounded-xl space-y-3">
                <div className="text-brand-green text-sm font-bold flex items-center space-x-2">
                  <span>✅ High Score Recorded!</span>
                </div>
                <p className="text-xs text-brand-light-gray">
                  Your score of <strong className="text-white">{score}/{quizQuestions.length} ({Math.round((score/quizQuestions.length)*100)}%)</strong> has been stored in your browser local storage.
                </p>
                <button
                  onClick={() => setActiveView('leaderboard')}
                  className="bg-brand-green text-brand-black font-bold text-xs px-4 py-2 rounded-lg hover:bg-brand-green-dark transition-colors"
                >
                  View My Rank on Leaderboard →
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <motion.button 
              onClick={handleRestart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-gray-dark hover:bg-brand-border text-white font-bold py-3 px-8 rounded-full text-base border border-brand-border transition-colors duration-300"
            >
              🔄 Try Again
            </motion.button>

            <motion.button 
              onClick={() => setActiveView('leaderboard')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-green text-brand-black font-bold py-3 px-8 rounded-full text-base hover:bg-brand-green-dark transition-colors duration-300 shadow-lg shadow-brand-green/20"
            >
              🏆 View Leaderboard
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* VIEW 3: ACTIVE QUIZ QUESTIONS */}
      {activeView === 'quiz' && !quizFinished && (
        <motion.div 
          className="tech-card p-8 sm:p-10 rounded-2xl relative overflow-hidden"
          layout
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs uppercase tracking-widest text-brand-light-gray font-bold">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
            <div className="h-1.5 w-32 bg-brand-border rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-green"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight">{currentQuestion.question}</h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = 'bg-brand-gray-dark/40 hover:bg-brand-border/60';
                  if (showFeedback) {
                    if (index === currentQuestion.correctAnswerIndex) {
                      buttonClass = 'bg-brand-green/20 border-brand-green text-brand-green';
                    } else if (index === selectedAnswer) {
                      buttonClass = 'bg-brand-red/20 border-brand-red text-brand-red';
                    }
                  }
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      whileHover={!showFeedback ? { x: 10, backgroundColor: 'rgba(138, 201, 38, 0.1)' } : {}}
                      className={`w-full text-left p-5 rounded-xl border border-brand-border transition-all duration-300 font-medium text-lg ${buttonClass} ${!showFeedback ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="opacity-30 font-mono text-sm">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showFeedback && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-10 pt-10 border-t border-brand-border/50 text-center"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`text-2xl font-black mb-6 uppercase tracking-tighter ${isCorrect ? 'text-brand-green' : 'text-brand-red'}`}
                >
                  {isCorrect ? 'Correct Transmission' : 'Signal Interference'}
                </motion.div>
                
                <div className="text-left bg-brand-black/40 p-6 rounded-xl border border-brand-border/50 mb-8">
                  <h4 className="text-xs uppercase tracking-widest text-brand-light-gray font-bold mb-3">Analysis</h4>
                  <p className="text-brand-light-gray leading-relaxed">{currentQuestion.rationale}</p>
                </div>

                <motion.button
                  onClick={handleNextQuestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-brand-green text-brand-black font-bold py-3 px-10 rounded-full text-lg hover:bg-brand-green-dark transition-all duration-300 shadow-lg shadow-brand-green/20"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
