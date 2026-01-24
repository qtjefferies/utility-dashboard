import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Shield } from 'lucide-react';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Stat {
  id: string;
  value: number;
  suffix: string;
  prefix: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const stats: Stat[] = [
  {
    id: 'athletes',
    value: 2500,
    suffix: '+',
    prefix: '',
    label: 'Athletes',
    description: 'Trust us with their NIL',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'managed',
    value: 12,
    suffix: 'M+',
    prefix: '$',
    label: 'NIL Managed',
    description: 'Total deals tracked',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'saved',
    value: 3.2,
    suffix: 'M',
    prefix: '$',
    label: 'Tax Saved',
    description: 'Through smart planning',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'compliance',
    value: 100,
    suffix: '%',
    prefix: '',
    label: 'Compliance',
    description: 'Zero violations',
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
  },
];

function useCountUp(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted) return;

    setHasStarted(true);

    const startTime = Date.now();
    const isDecimal = end % 1 !== 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * end;

      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView, startOnView, hasStarted]);

  return { count, ref };
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { count, ref } = useCountUp(stat.value, 2500);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        delay: index * 0.15,
        duration: 0.7,
        ease: easeOutExpo,
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="relative group"
    >
      {/* Background glow on hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
      />

      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 group-hover:border-white/20 transition-colors">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 shadow-lg`}
        >
          <Icon className="text-white" size={28} />
        </div>

        {/* Number */}
        <div className="mb-2">
          <span className="text-5xl md:text-6xl font-bold text-white">
            {stat.prefix}
            {typeof count === 'number' && count % 1 !== 0
              ? count.toFixed(1)
              : count}
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <h3 className="text-xl font-semibold text-white mb-1">{stat.label}</h3>
        <p className="text-white/50">{stat.description}</p>

        {/* Decorative corner */}
        <div className="absolute top-4 right-4 w-20 h-20 opacity-5">
          <Icon className="w-full h-full text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by athletes{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              everywhere
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Join thousands of college athletes who are taking control of their financial future.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        {/* Trust logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20"
        >
          <p className="text-center text-white/40 text-sm mb-8 uppercase tracking-widest">
            Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            {['ESPN', 'Forbes', 'Bleacher Report', 'The Athletic', 'Sports Illustrated'].map(
              (name) => (
                <div
                  key={name}
                  className="text-white/60 font-bold text-lg md:text-xl tracking-tight"
                >
                  {name}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
