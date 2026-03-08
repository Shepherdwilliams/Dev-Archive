
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions } from '../constants';

export const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

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
  }

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center tech-card p-12 rounded-2xl max-w-2xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-6">Quiz Complete!</h2>
        <div className="text-6xl font-black text-brand-green mb-8">{score} / {quizQuestions.length}</div>
        <p className="text-xl text-brand-light-gray mb-10">
          {score === quizQuestions.length ? "Perfect score! You're an AI master." : "Great effort! Keep learning to master the concepts."}
        </p>
        <motion.button 
          onClick={handleRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-green text-brand-black font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-green-dark transition-colors duration-300 shadow-lg shadow-brand-green/20"
        >
          Restart Quiz
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-center text-white mb-12 tracking-tight glow-text"
      >
        Test Your Knowledge
      </motion.h1>
      
      <motion.div 
        className="tech-card p-8 sm:p-10 rounded-2xl relative overflow-hidden"
        layout
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs uppercase tracking-widest text-brand-light-gray font-bold">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
          <div className="h-1 w-32 bg-brand-border rounded-full overflow-hidden">
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
    </div>
  );
};