import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  DealPipelineVisual,
  TaxVaultVisual,
  ComplianceShieldVisual,
  LegacyBuilderVisual,
} from './AnimatedVisuals';

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  visual: {
    gradient: string;
    label: string;
    component: React.ComponentType;
  };
}

const chapters: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Track Every Deal',
    subtitle: 'Complete Visibility',
    description:
      'Monitor all your NIL partnerships in one unified dashboard. From brand collaborations to endorsement contracts, never miss a payment or deadline again.',
    visual: {
      gradient: 'from-violet-600 via-purple-600 to-indigo-700',
      label: 'Deal Pipeline',
      component: DealPipelineVisual,
    },
  },
  {
    id: 'chapter-2',
    title: 'Automate Your Taxes',
    subtitle: 'Tax Vault Technology',
    description:
      'Never get caught off guard at tax time. We automatically set aside the right percentage from every payment, estimate quarterly taxes, and keep you prepared year-round.',
    visual: {
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      label: 'Tax Vault',
      component: TaxVaultVisual,
    },
  },
  {
    id: 'chapter-3',
    title: 'Stay Compliant',
    subtitle: 'Zero Risk',
    description:
      'Automatic compliance monitoring ensures every deal meets NCAA and state regulations. Get alerts before issues arise, not after.',
    visual: {
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      label: 'Compliance Shield',
      component: ComplianceShieldVisual,
    },
  },
  {
    id: 'chapter-4',
    title: 'Build Your Legacy',
    subtitle: 'Long-term Growth',
    description:
      'Your athletic career is just the beginning. Manage cash flow, grow your brand, and create sustainable wealth beyond the field.',
    visual: {
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
      label: 'Legacy Builder',
      component: LegacyBuilderVisual,
    },
  },
];

// Premium easing curves (typed as tuple for framer-motion)
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const chapterVariants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: easeOutExpo,
    },
  },
};

const visualVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

interface ChapterBlockProps {
  chapter: Chapter;
  index: number;
  onInView: (index: number, inView: boolean) => void;
}

function ChapterBlock({ chapter, index, onInView }: ChapterBlockProps) {
  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: false,
  });

  useEffect(() => {
    onInView(index, inView);
  }, [inView, index, onInView]);

  return (
    <motion.div
      ref={ref}
      variants={chapterVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="min-h-[70vh] flex flex-col justify-center py-16 lg:py-24"
    >
      <span className="text-sm font-medium tracking-widest text-white/40 uppercase mb-4">
        {chapter.subtitle}
      </span>
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
        {chapter.title}
      </h3>
      <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-lg">
        {chapter.description}
      </p>

      {/* Mobile-only visual */}
      <div className="mt-10 lg:hidden">
        <div
          className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${chapter.visual.gradient} shadow-2xl overflow-hidden relative`}
        >
          <chapter.visual.component />
        </div>
      </div>
    </motion.div>
  );
}

interface VisualPanelProps {
  activeChapter: Chapter;
}

function VisualPanel({ activeChapter }: VisualPanelProps) {
  const VisualComponent = activeChapter.visual.component;

  return (
    <div className="relative w-full h-full min-h-[50vh] lg:min-h-[70vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChapter.id}
          variants={visualVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${activeChapter.visual.gradient} shadow-2xl overflow-hidden`}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Animated visual component */}
          <div className="relative z-10 w-full h-full">
            <VisualComponent />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function StickyStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChapterInView = (index: number, inView: boolean) => {
    if (inView) {
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left column: Chapters */}
          <div className="relative">
            {chapters.map((chapter, index) => (
              <ChapterBlock
                key={chapter.id}
                chapter={chapter}
                index={index}
                onInView={handleChapterInView}
              />
            ))}
          </div>

          {/* Right column: Sticky visual panel (desktop only) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-24 h-[calc(100vh-12rem)]">
              <VisualPanel activeChapter={chapters[activeIndex]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
