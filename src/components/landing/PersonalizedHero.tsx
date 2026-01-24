import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Sport {
  id: string;
  name: string;
  emoji: string;
  headline: string;
  subtext: string;
  gradient: string;
  stats: {
    avgDeal: string;
    topEarner: string;
  };
}

const sports: Sport[] = [
  {
    id: 'football',
    name: 'Football',
    emoji: '🏈',
    headline: 'Dominate your NIL game',
    subtext: 'From game day to payday—track every sponsorship, endorsement, and collective payment.',
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    stats: { avgDeal: '$15,000', topEarner: '$3.2M' },
  },
  {
    id: 'basketball',
    name: 'Basketball',
    emoji: '🏀',
    headline: 'Ball out on and off the court',
    subtext: 'Social media deals, shoe contracts, camp appearances—manage it all in one place.',
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    stats: { avgDeal: '$12,500', topEarner: '$2.8M' },
  },
  {
    id: 'baseball',
    name: 'Baseball',
    emoji: '⚾',
    headline: 'Hit a home run with your NIL',
    subtext: 'From trading cards to local endorsements—build your brand beyond the diamond.',
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    stats: { avgDeal: '$8,000', topEarner: '$1.5M' },
  },
  {
    id: 'soccer',
    name: 'Soccer',
    emoji: '⚽',
    headline: 'Score big with your brand',
    subtext: 'International appeal, local deals—maximize your global marketability.',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    stats: { avgDeal: '$7,500', topEarner: '$1.2M' },
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    emoji: '🏐',
    headline: 'Spike your earnings',
    subtext: 'Beach or indoor, NIL opportunities are everywhere—we help you catch them all.',
    gradient: 'from-yellow-400 via-orange-400 to-red-400',
    stats: { avgDeal: '$5,000', topEarner: '$800K' },
  },
  {
    id: 'track',
    name: 'Track & Field',
    emoji: '🏃',
    headline: 'Run towards financial freedom',
    subtext: 'Shoe deals, supplement sponsors, appearance fees—track every dollar.',
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    stats: { avgDeal: '$6,000', topEarner: '$950K' },
  },
];

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: easeOutExpo,
    },
  },
};

const floatTransition = {
  duration: 6,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

export default function PersonalizedHero() {
  const [selectedSport, setSelectedSport] = useState<Sport>(sports[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate through sports
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setSelectedSport((current) => {
        const currentIndex = sports.findIndex((s) => s.id === current.id);
        const nextIndex = (currentIndex + 1) % sports.length;
        return sports[nextIndex];
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    setIsAutoRotating(false);

    // Clear any existing timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    // Resume auto-rotation after 7 seconds
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoRotating(true);
    }, 7000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-24">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Dynamic gradient based on sport */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSport.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={floatTransition}
              className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r ${selectedSport.gradient} opacity-20 rounded-full blur-[128px]`}
            />
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [10, -10, 10] }}
              transition={{ ...floatTransition, delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Hero content */}
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Sport selector pills */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleSportSelect(sport)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedSport.id === sport.id
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{sport.emoji}</span>
                {sport.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Built for {selectedSport.name} Athletes
          </span>
        </motion.div>

        {/* Dynamic headline */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={selectedSport.id + '-headline'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8"
          >
            {selectedSport.headline.split(' ').slice(0, -2).join(' ')}
            <br />
            <span className={`bg-gradient-to-r ${selectedSport.gradient} bg-clip-text text-transparent`}>
              {selectedSport.headline.split(' ').slice(-2).join(' ')}
            </span>
          </motion.h1>
        </AnimatePresence>

        {/* Dynamic subtext */}
        <AnimatePresence mode="wait">
          <motion.p
            key={selectedSport.id + '-subtext'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {selectedSport.subtext}
          </motion.p>
        </AnimatePresence>

        {/* Sport-specific stats */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-8 mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSport.id + '-stats'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex gap-8"
            >
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {selectedSport.stats.avgDeal}
                </p>
                <p className="text-white/40 text-sm">Avg. Deal Size</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {selectedSport.stats.topEarner}
                </p>
                <p className="text-white/40 text-sm">Top Earner</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-100"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className={`absolute inset-0 bg-gradient-to-r ${selectedSport.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <span className="absolute inset-0 flex items-center justify-center text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Get Started Free
              </span>
            </button>
            <button className="px-8 py-4 text-white/80 font-medium rounded-full border border-white/20 hover:bg-white/5 transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Animated mouse scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-7 h-11 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-1.5 h-1.5 rounded-full bg-white/60"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
