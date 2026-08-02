import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoIntroProps {
  onComplete: () => void;
}

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleExitComplete = () => {
    onComplete();
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = true;
      videoEl.defaultMuted = true;
      
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Autoplay was prevented by browser:", err);
            setIsPlaying(false);
          });
      }
    }

    // Backup timer to automatically transition after 7 seconds max
    const timer = setTimeout(() => {
      handleDismiss();
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
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
          {/* Full-screen MP4 Video Element */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onEnded={handleDismiss}
            onError={(e) => {
              console.warn("Video load error, skipping intro:", e);
              setTimeout(handleDismiss, 1000);
            }}
            className="w-full h-full object-cover relative z-10"
          >
            <source src="https://i.imgur.com/Ui44KJs.mp4" type="video/mp4" />
            <source src="https://i.imgur.com/HtTu7Ft.mp4" type="video/mp4" />
          </video>

          {/* Fallback Play Button if autoplay blocked */}
          {!isPlaying && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleManualPlay}
                className="bg-brand-green text-brand-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center space-x-3 shadow-2xl shadow-brand-green/40 cursor-pointer"
              >
                <span className="text-xl">▶</span>
                <span>Play Intro Video</span>
              </motion.button>
              <button
                onClick={handleDismiss}
                className="mt-4 text-xs font-mono text-gray-400 hover:text-white underline tracking-wider cursor-pointer"
              >
                Skip straight to app →
              </button>
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
