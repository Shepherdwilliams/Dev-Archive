
import React, { useState } from 'react';
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
      <div className="text-center bg-brand-gray-dark p-8 rounded-xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
        <p className="text-xl text-brand-green mb-6">Your Score: {score} / {quizQuestions.length}</p>
        <button 
          onClick={handleRestart}
          className="bg-brand-green text-brand-black font-bold py-2 px-6 rounded-full hover:bg-brand-green-dark transition-colors duration-300"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Test Your Knowledge</h1>
      <div className="bg-brand-gray-dark p-8 rounded-xl border border-brand-border shadow-lg">
        <p className="text-sm text-brand-light-gray mb-2">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
        <h2 className="text-2xl font-semibold text-white mb-6">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'bg-brand-gray-dark hover:bg-brand-border';
            if (showFeedback) {
              if (index === currentQuestion.correctAnswerIndex) {
                buttonClass = 'bg-brand-green/50 border-brand-green';
              } else if (index === selectedAnswer) {
                buttonClass = 'bg-brand-red/50 border-brand-red';
              }
            }
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border border-brand-border transition-colors duration-200 text-white ${buttonClass} ${!showFeedback ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 text-center">
            <p className={`text-lg font-bold ${isCorrect ? 'text-brand-green' : 'text-brand-red'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect.'}
            </p>
            <div className="mt-4 text-left bg-brand-black/50 p-4 rounded-lg border border-brand-border">
              <h4 className="font-bold text-white">Rationale:</h4>
              <p className="text-brand-light-gray">{currentQuestion.rationale}</p>
            </div>
            <button
              onClick={handleNextQuestion}
              className="mt-4 bg-brand-green text-brand-black font-bold py-2 px-6 rounded-full hover:bg-brand-green-dark transition-colors duration-300"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};