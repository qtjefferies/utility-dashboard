import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ScrollProgressProps {
  /** Color of the progress bar */
  color?: string;
  /** Height of the progress bar in pixels */
  height?: number;
  /** Whether to show the progress bar */
  show?: boolean;
}

export default function ScrollProgress({
  color = 'from-emerald-500 to-teal-500',
  height = 3,
  show = true,
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Use spring for smooth animation
  const scaleX = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] origin-left"
      style={{
        height,
        scaleX,
      }}
    >
      <div className={`w-full h-full bg-gradient-to-r ${color}`} />
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} blur-sm opacity-50`}
      />
    </motion.div>
  );
}
