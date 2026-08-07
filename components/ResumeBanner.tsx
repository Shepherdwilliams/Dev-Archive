import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { UserProgressState } from '../types';
import { sciFiAudio } from './SoundEffects';

interface ResumeBannerProps {
  progress: UserProgressState | null;
  onResume: (stepId: string, moduleId?: string) => void;
}

export const ResumeBanner: React.FC<ResumeBannerProps> = ({
  progress,
  onResume
}) => {
  if (!progress || !progress.lastCompletedStepId) return null;

  const handleResume = () => {
    sciFiAudio.playSuccess();
    onResume(progress.lastCompletedStepId, progress.lastCompletedModuleId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-brand-green/40 rounded-2xl p-4 sm:p-5 shadow-xl font-mono text-white flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-green/20 border border-brand-green/50 flex items-center justify-center text-brand-green shrink-0 shadow-lg shadow-brand-green/20">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/30">
              SAVED PROGRESS DETECTED
            </span>
            <span className="text-xs text-brand-light-gray font-bold">
              {progress.completionPercentage}% Overall Progress
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Continue where you left off: <span className="text-brand-green">{progress.lastCompletedStepId}</span>
          </h4>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="hidden md:block w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-brand-green transition-all duration-500"
            style={{ width: `${progress.completionPercentage}%` }}
          />
        </div>

        <button
          onClick={handleResume}
          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-brand-green hover:bg-brand-green-light text-brand-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20 transition-all hover:scale-105"
        >
          <Play className="w-4 h-4 fill-brand-black" />
          <span>Resume Session</span>
        </button>
      </div>
    </motion.div>
  );
};
