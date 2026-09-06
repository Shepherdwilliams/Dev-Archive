import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoIntroProps {
  onComplete: () => void;
}

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleExitComplete = () => {
    onComplete();
  };

  const attemptPlay = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = true;
    videoEl.defaultMuted = true;

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((err) => {
          console.warn("Autoplay policy restricted video:", err);
          // Only show manual play button if browser explicitly prevented playback
          setAutoplayBlocked(true);
        });
    }
  }, []);

  useEffect(() => {
    // Attempt playback immediately upon mount
    attemptPlay();

    // Safety timer to automatically transition if video hangs or finishes
    const timer = setTimeout(() => {
      handleDismiss();
    }, 10500);

    return () => clearTimeout(timer);
  }, [attemptPlay, handleDismiss]);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((err) => {
          console.error("Manual play error:", err);
        });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          key="video-intro-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none"
          style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, backgroundColor: '#000000' }}
        >
          {/* Fast-loading Video Element with instant Poster & optimized local sources */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/intro-poster.webp"
            onLoadedData={() => {
              setIsLoaded(true);
              attemptPlay();
            }}
            onCanPlay={() => {
              setIsLoaded(true);
              attemptPlay();
            }}
            onPlaying={() => {
              setIsPlaying(true);
              setAutoplayBlocked(false);
            }}
            onEnded={handleDismiss}
            onError={(e) => {
              console.warn("Video load error, skipping intro:", e);
              setTimeout(handleDismiss, 800);
            }}
            className={`w-full h-full object-cover relative z-10 transition-opacity duration-300 ${
              isLoaded || isPlaying ? 'opacity-100' : 'opacity-90'
            }`}
          >
            {/* 1. Faststart local MP4 (moov atom at byte 0 for zero-latency streaming) */}
            <source src="/intro.mp4" type="video/mp4" />
            {/* 2. Modern VP9 WebM for ultra-high compression efficiency */}
            <source src="/intro.webm" type="video/webm" />
            {/* 3. Redundant CDN Fallback */}
            <source src="https://i.imgur.com/Ui44KJs.mp4" type="video/mp4" />
          </video>

          {/* Autoplay blocked prompt (only shown if browser explicitly restricts autoplay) */}
          {autoplayBlocked && !isPlaying && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleManualPlay}
                className="bg-brand-green text-brand-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center space-x-3 shadow-2xl shadow-brand-green/40 cursor-pointer"
              >
                <span className="text-xl">▶</span>
                <span>Launch Intro</span>
              </motion.button>
              <button
                onClick={handleDismiss}
                className="mt-4 text-xs font-mono text-gray-400 hover:text-white underline tracking-wider cursor-pointer"
              >
                Skip straight to platform →
              </button>
            </div>
          )}

          {/* Subtle instant loading pulse if video stream is preparing */}
          {!isLoaded && !isPlaying && !autoplayBlocked && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full border-2 border-brand-green/20 border-t-brand-green animate-spin" />
            </div>
          )}

          {/* Ambient radial vignette */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

          {/* Top Brand Header Badge */}
          <div className="absolute top-6 left-6 z-30 flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-green/40 text-brand-green text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
            <span>DEV.ARCHIVE // INTRO</span>
          </div>

          {/* Top Right Skip Intro Button */}
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={handleDismiss}
              className="px-5 py-2 rounded-full bg-black/80 hover:bg-black text-white border border-brand-green/50 text-xs font-mono font-bold uppercase tracking-wider hover:border-brand-green transition-all shadow-lg backdrop-blur-md cursor-pointer flex items-center space-x-2 active:scale-95"
            >
              <span>Skip Intro</span>
              <span className="text-brand-green text-sm">→</span>
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="px-4 py-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white/90 border border-white/20 hover:border-brand-green/60 text-xs font-mono transition-all backdrop-blur-md cursor-pointer flex items-center space-x-2 active:scale-95 shadow-lg"
            >
              <span>{isMuted ? "🔇 Sound OFF" : "🔊 Sound ON"}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
