
import React from 'react';

const curriculumTopics = [
  { title: 'Module 1: AI Foundations', description: 'Start your journey here. Learn what AI is, discover its fascinating history, and understand the difference between today\'s Narrow AI and the futuristic AGI.', icon: '🧠' },
  { title: 'Module 2: Neural Networks', description: 'Peek under the hood. Discover how artificial neurons and layers, inspired by the human brain, work together to learn patterns from data.', icon: '🕸️' },
  { title: 'Module 3: Understanding LLMs', description: 'Dive into the tech behind chatbots. Learn about the game-changing "Transformer" architecture and how models generate human-like text.', icon: '📚' },
  { title: 'Module 4: Prompt Engineering', description: 'Learn to speak the language of AI. Master the art of crafting effective prompts to unlock the full potential of language models for any task.', icon: '✍️' },
  { title: 'Module 5: AI Ethics', description: 'Explore the important conversations surrounding AI. We cover critical topics like bias, privacy, and the impact of AI on the future of work.', icon: '🛡️' },
  { title: 'Test Your Knowledge', description: 'Solidify your understanding. Our interactive quizzes help you reinforce key concepts and track your learning progress through the course.', icon: '🎯' },
];

export const CurriculumGrid: React.FC = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center text-white mb-12">Curriculum at a Glance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {curriculumTopics.map((topic, index) => (
          <div key={index} className="bg-brand-gray-dark p-8 rounded-xl border border-brand-border hover:border-brand-green transition-colors duration-300 transform hover:-translate-y-2 flex flex-col">
            <div className="text-4xl mb-4">{topic.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{topic.title}</h3>
            <p className="text-brand-light-gray flex-grow">{topic.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};