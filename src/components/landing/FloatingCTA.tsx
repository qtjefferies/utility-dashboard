import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FloatingCTAProps {
  /** Scroll threshold in pixels before showing the CTA */
  showAfter?: number;
  /** Text to display on the button */
  text?: string;
  /** Click handler */
  onClick?: () => void;
  /** Link href (alternative to onClick) */
  href?: string;
}

export default function FloatingCTA({
  showAfter = 800,
  text = 'Get Started Free',
  onClick,
  href = '#signup',
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > showAfter);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      // Smooth scroll for anchor links
      if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.location.href = href;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
        >
          {/* Glow effect */}
          <motion.div
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0.6 : 0.4,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl"
          />

          {/* Button */}
          <motion.button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 transition-shadow hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <span>{text}</span>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.button>

          {/* Pulse ring animation */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full -z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
