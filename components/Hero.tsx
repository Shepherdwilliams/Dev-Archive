
import React from 'react';

interface HeroProps {
  onStartLearning: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning }) => {
  return (
    <section className="text-center py-20 md:py-32">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
        Master <span className="text-brand-green">AI</span> in 30 Days
      </h1>
      <p className="text-lg md:text-xl text-brand-light-gray max-w-3xl mx-auto mb-8">
        Your journey from beginner to practitioner starts here. Learn the fundamentals of Artificial Intelligence through our interactive, hands-on curriculum.
      </p>
      <button 
        onClick={onStartLearning}
        className="bg-brand-green text-brand-black font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-green-dark transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-green/20"
      >
        Start Learning Now
      </button>
    </section>
  );
};