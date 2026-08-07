import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
  Atom,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  Zap,
  HelpCircle,
  BookOpen,
  ChevronRight,
  Trophy,
  Brain,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { PeriodicTable } from './PeriodicTable';
import { sciFiAudio } from './SoundEffects';

export interface PeriodicQuestion {
  id: string;
  category: 'basics' | 'orbitals' | 'trends' | 'stse';
  categoryLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  stseContext?: string;
  visualHint?: string;
}

const PERIODIC_QUIZ_QUESTIONS: PeriodicQuestion[] = [
  {
    id: 'pt-1',
    category: 'basics',
    categoryLabel: 'Elemental Basics & Groups',
    question: 'Which group on the periodic table contains the Noble Gases with fully filled valence shells?',
    options: [
      'Group 1 (Alkali Metals)',
      'Group 17 (Halogens)',
      'Group 18 (Noble Gases)',
      'Group 2 (Alkaline Earth Metals)'
    ],
    correctIndex: 2,
    explanation: 'Group 18 elements (Helium, Neon, Argon, Krypton, Xenon, Radon, Oganesson) possess completely filled valence electron shells (e.g. $ns^2 np^6$), making them chemically inert under standard conditions.',
    stseContext: 'Liquid Helium ($He$) is essential in medicine for cooling superconducting magnets in Magnetic Resonance Imaging (MRI) machines to $4.2\\text{ K}$.',
    visualHint: 'Look at the far right column (Column 18) of the Zperiod table—notice the stable, spherically symmetric electron clouds.'
  },
  {
    id: 'pt-2',
    category: 'orbitals',
    categoryLabel: 'Electron Configurations & Blocks',
    question: 'What is the correct ground-state electron configuration for Carbon ($C$, $Z=6$)?',
    options: [
      '$1s^2 2s^2 2p^2$',
      '$1s^2 2s^1 2p^3$',
      '$1s^2 2p^4$',
      '$1s^2 2s^2 2p^4$'
    ],
    correctIndex: 0,
    explanation: 'According to the Aufbau principle, Hund\'s rule, and the Pauli exclusion principle, Carbon ($Z=6$) fills orbitals in order of increasing energy: $1s^2 2s^2 2p^2$.',
    stseContext: 'The 4 valence electrons of carbon ($2s^2 2p^2$) allow $sp^3$, $sp^2$, and $sp$ hybridization, enabling the synthesis of graphene, carbon nanotubes, and synthetic diamond heat sinks.',
    visualHint: 'Visualize two electrons in the inner $1s$ sphere, two in the outer $2s$ sphere, and two in orthogonal dumbbell-shaped $2p$ lobes.'
  },
  {
    id: 'pt-3',
    category: 'trends',
    categoryLabel: 'Periodic Trends & Electronegativity',
    question: 'Which of the following elements exhibits the highest Pauling electronegativity value on the periodic table?',
    options: [
      'Francium ($Fr$)',
      'Fluorine ($F$)',
      'Oxygen ($O$)',
      'Chlorine ($Cl$)'
    ],
    correctIndex: 1,
    explanation: 'Fluorine ($F$) has the highest electronegativity ($3.98$ on the Pauling scale) due to its high effective nuclear charge ($Z_{eff}$) and small atomic radius ($64\\text{ pm}$).',
    stseContext: 'Fluorine\'s extreme electronegativity makes Teflon (polytetrafluoroethylene, $(C_2F_4)_n$) virtually chemically inert and essential for non-reactive satellite tubing and frying pans.',
    visualHint: 'Find Fluorine in Period 2, Group 17. The strong nuclear pull draws its $2p$ electron cloud tightly toward the nucleus.'
  },
  {
    id: 'pt-4',
    category: 'orbitals',
    categoryLabel: 'Electron Configurations & Blocks',
    question: 'To which valence orbital block ($s, p, d, f$) do the Transition Metals belong?',
    options: [
      '$s$-block',
      '$p$-block',
      '$d$-block',
      '$f$-block'
    ],
    correctIndex: 2,
    explanation: 'Transition Metals (Groups 3–12) are filling their inner $(n-1)d$ subshells, placing them in the central $d$-block of the periodic table.',
    stseContext: 'Titanium ($Ti$) and Inconel (Nickel-Chromium $d$-block alloy) maintain exceptional strength-to-weight ratios under extreme high-temperature aerospace combustion conditions.',
    visualHint: 'In the center 10 columns of the table, $d$-orbitals form cloverleaf-shaped electron density distributions around transition metal nuclei.'
  },
  {
    id: 'pt-5',
    category: 'trends',
    categoryLabel: 'Periodic Trends & Electronegativity',
    question: 'As you move from left to right across a Period (row), what happens to the atomic radius?',
    options: [
      'Atomic radius increases due to added electron shells.',
      'Atomic radius remains completely constant.',
      'Atomic radius decreases due to increasing effective nuclear charge ($Z_{eff}$).',
      'Atomic radius fluctuates randomly.'
    ],
    correctIndex: 2,
    explanation: 'Across a period, protons are added to the nucleus while electrons fill the same principal energy level ($n$). The higher nuclear charge pulls the electron cloud closer, decreasing atomic radius.',
    stseContext: 'Controlling atomic radii across period 3 is critical in semiconductor doping, such as embedding Phosphorus ($P$) into Silicon ($Si$) lattices for microprocessors.',
    visualHint: 'Observe Period 3 from Sodium ($Na$, large radius) to Argon ($Ar$, tight compact cloud).'
  },
  {
    id: 'pt-6',
    category: 'stse',
    categoryLabel: 'STSE & Real-World Applications',
    question: 'Which semiconductor element from Group 14 forms the foundation of modern photovoltaic solar panels and computer integrated circuits?',
    options: [
      'Germanium ($Ge$)',
      'Silicon ($Si$)',
      'Gallium ($Ga$)',
      'Arsenic ($As$)'
    ],
    correctIndex: 1,
    explanation: 'Silicon ($Si$, $Z=14$) has a diamond cubic crystal structure and an indirect bandgap of $1.12\\text{ eV}$, making it the primary material for transistors, solar cells, and microchips.',
    stseContext: 'Over $90\\%$ of global digital computing hardware relies on hyper-pure ($99.9999999\\%$) monocrystalline silicon wafers.',
    visualHint: 'Silicon is located in Period 3, Group 14 below Carbon.'
  },
  {
    id: 'pt-7',
    category: 'basics',
    categoryLabel: 'Elemental Basics & Groups',
    question: 'Which element is the most abundant chemical element in the observable Universe, comprising approximately $75\\%$ of all baryonic mass?',
    options: [
      'Helium ($He$)',
      'Oxygen ($O$)',
      'Hydrogen ($H$)',
      'Carbon ($C$)'
    ],
    correctIndex: 2,
    explanation: 'Hydrogen ($H$, $Z=1$) was formed in immense quantities during Big Bang Nucleosynthesis ($t \\approx 100\\text{--}300\\text{ seconds}$) and powers stellar proton-proton chain fusion.',
    stseContext: 'Hydrogen fuel cell vehicles use $2H_2 + O_2 \\rightarrow 2H_2O$, emitting zero greenhouse gases during zero-emission transport.',
    visualHint: 'Hydrogen sits at Position 1 with a single proton and single electron in a $1s$ orbital.'
  },
  {
    id: 'pt-8',
    category: 'stse',
    categoryLabel: 'STSE & Real-World Applications',
    question: 'What catalyst metal ($Z=78$) is used in hydrogen fuel cell Proton Exchange Membranes (PEM) and automotive catalytic converters to convert $CO$ to $CO_2$?',
    options: [
      'Gold ($Au$)',
      'Platinum ($Pt$)',
      'Silver ($Ag$)',
      'Copper ($Cu$)'
    ],
    correctIndex: 1,
    explanation: 'Platinum ($Pt$, $Z=78$) has a unique $d$-band electronic structure that lowers activation energy for oxygen reduction and oxidation reactions without consuming the metal itself.',
    stseContext: 'Recycling platinum from industrial catalysts reduces toxic heavy-metal mining tailings and conserves critical rare-earth and platinum-group metal reserves.',
    visualHint: 'Find Platinum in Period 6, Group 10—a precious $5d$ transition metal.'
  }
];

export const PeriodicTableQuiz: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selected: number; isCorrect: boolean }[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showHelperTable, setShowHelperTable] = useState(false);

  // Filter questions based on selected category
  const filteredQuestions = PERIODIC_QUIZ_QUESTIONS.filter(q =>
    selectedCategory === 'all' ? true : q.category === selectedCategory
  );

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0];

  const handleCategoryChange = (cat: string) => {
    sciFiAudio.playClick();
    setSelectedCategory(cat);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setStreak(0);
    setUserAnswers([]);
    setQuizComplete(false);
  };

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    sciFiAudio.playClick();
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;

    const correct = selectedOption === currentQ.correctIndex;
    setIsSubmitted(true);

    if (correct) {
      sciFiAudio.playSuccess();
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      sciFiAudio.playClick();
      setStreak(0);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: selectedOption,
        isCorrect: correct
      }
    ]);
  };

  const handleNextQuestion = () => {
    sciFiAudio.playClick();
    if (currentIdx + 1 < filteredQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    sciFiAudio.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setStreak(0);
    setUserAnswers([]);
    setQuizComplete(false);
  };

  const getRankBadge = (percentage: number) => {
    if (percentage === 100) return { title: 'Quantum Physics Master', color: 'text-amber-400 border-amber-400/40 bg-amber-400/10' };
    if (percentage >= 75) return { title: 'Senior Materials Scientist', color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' };
    if (percentage >= 50) return { title: 'Zperiod Lab Researcher', color: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10' };
    return { title: 'STEM Apprentice', color: 'text-slate-400 border-slate-700 bg-slate-800' };
  };

  const totalQuestions = filteredQuestions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const rank = getRankBadge(percentage);

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Atom className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded uppercase">
                ZPERIOD LAB PEDAGOGY
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                Grade 9-12 / Undergrad
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Periodic Table & Elemental Fact <span className="text-emerald-400">Quiz</span>
            </h2>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'basics', label: 'Groups & Basics' },
            { id: 'orbitals', label: 'Configurations' },
            { id: 'trends', label: 'Trends' },
            { id: 'stse', label: 'STSE Impact' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helper Reference Toggle Button */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            Score: <strong className="text-emerald-400">{score}</strong> / {totalQuestions}
          </span>
          {streak > 1 && (
            <span className="text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold animate-pulse">
              <Zap className="w-3 h-3" /> {streak}x Streak!
            </span>
          )}
        </div>

        <button
          onClick={() => {
            sciFiAudio.playClick();
            setShowHelperTable(!showHelperTable);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
            showHelperTable
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showHelperTable ? 'Hide Periodic Reference' : 'Open Periodic Reference'}</span>
        </button>
      </div>

      {/* Helper Periodic Grid Drawer */}
      <AnimatePresence>
        {showHelperTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400">Zperiod Quick Reference Grid</span>
              <span>Click element to inspect atomic data</span>
            </div>
            <PeriodicTable onSelectElement={(sym) => console.log('Inspected:', sym)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!quizComplete ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span className="text-emerald-400 uppercase font-bold">
                Question {currentIdx + 1} of {totalQuestions} • {currentQ.categoryLabel}
              </span>
              <span>{Math.round(((currentIdx + 1) / totalQuestions) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                className="h-full bg-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {currentQ.question}
                </ReactMarkdown>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQ.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQ.correctIndex;

                let optionStyles = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-400/60 hover:bg-slate-800/60';

                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyles = 'bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/10';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyles = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  } else {
                    optionStyles = 'bg-slate-950 border-slate-900 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border ${
                        isSelected
                          ? 'bg-emerald-400 text-black border-emerald-400'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {optionText}
                        </ReactMarkdown>
                      </span>
                    </div>

                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Detailed Explanation */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className={`p-5 rounded-2xl border ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold uppercase text-xs mb-2">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Correct Synthesis!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400">Incorrect Analysis</span>
                      </>
                    )}
                  </div>

                  <div className="text-xs space-y-2 text-slate-300">
                    <p className="leading-relaxed">
                      <strong className="text-white">Explanation: </strong>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {currentQ.explanation}
                      </ReactMarkdown>
                    </p>

                    {currentQ.stseContext && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                        <div>
                          <strong className="text-cyan-400 uppercase">STSE Context: </strong>
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {currentQ.stseContext}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {currentQ.visualHint && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-start gap-2">
                        <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <strong className="text-amber-400 uppercase">3D Atom Model Visualizer: </strong>
                          <span>{currentQ.visualHint}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-400/20 cursor-pointer transition-all"
                  >
                    <span>{currentIdx + 1 === totalQuestions ? 'View Final Report' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Action Button before submission */}
          {!isSubmitted && (
            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-400/20 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Answer</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Completion Report */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              RESEARCH EVALUATION COMPLETE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Periodic Table Quiz Report
            </h3>
          </div>

          {/* Rank Badge */}
          <div className="max-w-md mx-auto p-4 rounded-2xl border flex items-center justify-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Assigned Designation</span>
              <strong className={`text-base font-bold ${rank.color.split(' ')[0]}`}>{rank.title}</strong>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto font-mono">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 block uppercase">Total Questions</span>
              <span className="text-xl font-bold text-white">{totalQuestions}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 block uppercase">Correct</span>
              <span className="text-xl font-bold text-emerald-400">{score}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
              <span className="text-xl font-bold text-cyan-400">{percentage}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-400/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => handleCategoryChange('all')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Atom className="w-4 h-4 text-emerald-400" />
              <span>Explore All Categories</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
