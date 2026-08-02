
import React from 'react';
import { motion } from 'framer-motion';

const curriculumTopics = [
  { step: '01', title: 'AI Foundations', description: 'Start your journey here. Learn what AI is, discover its history, and understand the distinction between Narrow AI and Artificial General Intelligence (AGI).', icon: '🧠', tag: 'Basics' },
  { step: '02', title: 'Neural Networks', description: 'Peek under the hood. Discover how artificial neurons and deep multi-layer perceptions process complex high-dimensional feature representations.', icon: '🕸️', tag: 'Architecture' },
  { step: '03', title: 'Understanding LLMs', description: 'Master the mechanics of generative AI. Explore multi-head self-attention mechanisms, tokenization pipelines, and contextual embeddings.', icon: '📚', tag: 'Transformers' },
  { step: '04', title: 'Prompt Engineering', description: 'Learn to speak the language of AI. Master zero-shot, few-shot, chain-of-thought prompting, and systematic instruction structuring.', icon: '✍️', tag: 'Strategy' },
  { step: '05', title: 'AI Ethics & Alignment', description: 'Navigate critical conversations around model bias, hallucination mitigation, privacy guarantees, safety guardrails, and societal impacts.', icon: '🛡️', tag: 'Governance' },
  { step: '06', title: 'Bots & Autonomous Agents', description: 'Build production multi-agent automation engines for social scheduling, financial triage, inbox routing, and tool-use orchestration.', icon: '🤖', tag: 'Automation' },
  { step: '07', title: 'Interactive Evaluation & Quizzes', description: 'Solidify your mental models. Take interactive quizzes, track high scores on the local persistent leaderboard, and earn completion certificates.', icon: '🎯', tag: 'Assessment' },
];

export const CurriculumGrid: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 border-t border-brand-border/60 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="mono-badge">
          02. CURRICULUM ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Designed for Clarity & Depth
        </h2>
        <p className="text-brand-light-gray text-base sm:text-lg">
          Each module provides interactive concepts, code patterns, real-world agent blueprints, and knowledge checkpoints.
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {curriculumTopics.map((topic, index) => (
          <motion.div 
            key={index} 
            variants={item}
            whileHover={{ y: -6 }}
            className="tech-card p-7 rounded-2xl flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Bar inside Card */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs font-extrabold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 rounded">
                MODULE // {topic.step}
              </span>
              <span className="text-xs font-mono text-brand-light-gray/70 uppercase">
                {topic.tag}
              </span>
            </div>

            {/* Icon + Title + Description */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{topic.icon}</span>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-green transition-colors leading-snug">
                  {topic.title}
                </h3>
              </div>

              <p className="text-brand-light-gray/90 text-sm leading-relaxed pt-1">
                {topic.description}
              </p>
            </div>

            {/* Bottom Accent line */}
            <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-mono text-brand-light-gray/60 group-hover:text-brand-green transition-colors">
              <span>EXPLORE CONTENT</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

