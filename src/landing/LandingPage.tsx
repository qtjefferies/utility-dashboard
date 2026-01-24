import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import StickyStory from '../components/landing/StickyStory';
import WaitlistSection from '../components/landing/WaitlistSection';
import ExitIntentPopup from '../components/landing/ExitIntentPopup';
import FloatingCTA from '../components/landing/FloatingCTA';
import PageLoader from '../components/landing/PageLoader';
import ScrollProgress from '../components/landing/ScrollProgress';
import PersonalizedHero from '../components/landing/PersonalizedHero';
import StatsSection from '../components/landing/StatsSection';
import LiveDashboardPreview from '../components/landing/LiveDashboardPreview';
import AIAssistantPreview from '../components/landing/AIAssistantPreview';

// Premium easing (typed as tuple for framer-motion)
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Smooth scroll helper
const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.startsWith('#')) {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const navItems = [
  { label: 'About Us', href: '#about' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-wider uppercase">
              tility Financial
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#signup"
              onClick={(e) => scrollToSection(e, '#signup')}
              className="px-5 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-white/90 transition-colors"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 border-t border-white/10">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-white/70 hover:text-white transition-colors text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#signup"
                  className="block w-full text-center px-5 py-3 bg-white text-black font-semibold rounded-full text-base"
                  onClick={(e) => {
                    scrollToSection(e, '#signup');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop blur bar */}
      <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-xl border-b border-white/5" />
    </motion.header>
  );
}


const ctaContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const ctaItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
};

function CTASection() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: easeOutExpo }}
          className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        variants={ctaContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.h2
          variants={ctaItemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
        >
          Ready to take control?
        </motion.h2>
        <motion.p
          variants={ctaItemVariants}
          className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
        >
          Join thousands of athletes who are already building their financial
          future with our platform.
        </motion.p>
        <motion.button
          variants={ctaItemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
        >
          Start Your Journey
        </motion.button>
      </motion.div>
    </section>
  );
}

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Page loader - shows on initial load */}
      <PageLoader onComplete={() => setIsLoaded(true)} />

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black min-h-screen"
      >
        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Navigation */}
        <Navbar />

        {/* Page sections */}
        <PersonalizedHero />
        <StickyStory />
        <LiveDashboardPreview />
        <AIAssistantPreview />
        <WaitlistSection />
        <CTASection />

        {/* Floating CTA - appears after scrolling past hero */}
        <FloatingCTA
          showAfter={800}
          text="Get Started Free"
          href="#signup"
        />

        {/* Exit intent popup - shows when user tries to leave */}
        <ExitIntentPopup />
      </motion.main>
    </>
  );
}
