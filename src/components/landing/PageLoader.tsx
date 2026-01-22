import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PageLoaderProps {
  /** Minimum time to show the loader in ms */
  minDuration?: number;
  /** Callback when loading is complete */
  onComplete?: () => void;
}

export default function PageLoader({
  minDuration = 1500,
  onComplete,
}: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Ease out the progress - faster at start, slower at end
        const increment = Math.max(1, (100 - prev) / 10);
        return Math.min(100, prev + increment);
      });
    }, 50);

    // Minimum display time
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        onComplete?.();
      }, 300);
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: easeOutExpo }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: easeOutExpo }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[80px]"
            />
          </div>

          {/* Logo and loader */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="mb-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white font-bold text-3xl"
                >
                  U
                </motion.span>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: easeOutExpo }}
              className="text-white font-semibold text-2xl mb-8"
            >
              Utility Financial
            </motion.h1>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ delay: 0.5, duration: 0.4, ease: easeOutExpo }}
              className="h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-white/40 text-sm"
            >
              Loading your experience...
            </motion.p>
          </div>

          {/* Animated corner accents */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ opacity: 0.5, x: 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: easeOutExpo }}
            className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-white/10 rounded-tl-3xl"
          />
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 0.5, x: 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: easeOutExpo }}
            className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-white/10 rounded-br-3xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
