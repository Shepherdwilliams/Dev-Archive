
import React from 'react';
import { motion } from 'framer-motion';

const curriculumTopics = [
  { title: 'Module 1: AI Foundations', description: 'Start your journey here. Learn what AI is, discover its fascinating history, and understand the difference between today\'s Narrow AI and the futuristic AGI.', icon: '🧠' },
  { title: 'Module 2: Neural Networks', description: 'Peek under the hood. Discover how artificial neurons and layers, inspired by the human brain, work together to learn patterns from data.', icon: '🕸️' },
  { title: 'Module 3: Understanding LLMs', description: 'Dive into the tech behind chatbots. Learn about the game-changing "Transformer" architecture and how models generate human-like text.', icon: '📚' },
  { title: 'Module 4: Prompt Engineering', description: 'Learn to speak the language of AI. Master the art of crafting effective prompts to unlock the full potential of language models for any task.', icon: '✍️' },
  { title: 'Module 5: AI Ethics', description: 'Explore the important conversations surrounding AI. We cover critical topics like bias, privacy, and the impact of AI on the future of work.', icon: '🛡️' },
  { title: 'Test Your Knowledge', description: 'Solidify your understanding. Our interactive quizzes help you reinforce key concepts and track your learning progress through the course.', icon: '🎯' },
];

export const CurriculumGrid: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16">
      <motion.h2 
        className="text-3xl md:text-5xl font-bold text-center text-white mb-16 tracking-tight"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Curriculum at a Glance
      </motion.h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {curriculumTopics.map((topic, index) => (
          <motion.div 
            key={index} 
            variants={item}
            whileHover={{ y: -10, borderColor: 'rgba(138, 201, 38, 0.5)' }}
            className="tech-card p-8 rounded-2xl flex flex-col group"
          >
            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{topic.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-green transition-colors">{topic.title}</h3>
            <p className="text-brand-light-gray flex-grow leading-relaxed">{topic.description}</p>
            <div className="mt-6 h-1 w-0 bg-brand-green group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
