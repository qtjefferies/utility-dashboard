import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Maximize2,
  X,
  TrendingUp,
  DollarSign,
  PiggyBank,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { HomePage } from '../../pages/HomePage';
import { CashFlowPage } from '../../pages/CashFlowPage';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Mini dashboard components for the preview
function MiniKPICard({
  label,
  value,
  icon: Icon,
  color,
  delay
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: easeOutExpo }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={16} className="text-white" />
        </div>
        <span className="text-white/60 text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

function MiniDealRow({
  name,
  amount,
  status,
  delay
}: {
  name: string;
  amount: string;
  status: 'active' | 'pending';
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: easeOutExpo }}
      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-white text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white font-medium">{amount}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'active'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-amber-500/20 text-amber-400'
        }`}>
          {status}
        </span>
      </div>
    </motion.div>
  );
}

function MiniChart({ delay }: { delay: number }) {
  const bars = [40, 65, 45, 80, 55, 90, 70];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-end gap-2 h-24"
    >
      {bars.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ delay: delay + i * 0.1, duration: 0.5, ease: easeOutExpo }}
          className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm"
        />
      ))}
    </motion.div>
  );
}

function InteractiveDashboard({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl overflow-hidden">
      {/* Mock top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="text-white font-semibold">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <span className="text-white/60 text-sm">Marcus T.</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-6 space-y-6">
        {/* KPI Row */}
        {isPlaying && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniKPICard
              label="Total Earned"
              value="$47,230"
              icon={DollarSign}
              color="bg-emerald-500"
              delay={0.2}
            />
            <MiniKPICard
              label="Tax Vault"
              value="$13,224"
              icon={PiggyBank}
              color="bg-purple-500"
              delay={0.3}
            />
            <MiniKPICard
              label="Available"
              value="$34,006"
              icon={TrendingUp}
              color="bg-blue-500"
              delay={0.4}
            />
            <MiniKPICard
              label="Deals Active"
              value="8"
              icon={FileCheck}
              color="bg-amber-500"
              delay={0.5}
            />
          </div>
        )}

        {/* Two column layout */}
        {isPlaying && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Deals list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: easeOutExpo }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Active Deals</h3>
                <ChevronRight size={16} className="text-white/40" />
              </div>
              <MiniDealRow name="Nike Partnership" amount="$5,000" status="active" delay={0.7} />
              <MiniDealRow name="Local Auto Dealer" amount="$2,400" status="active" delay={0.8} />
              <MiniDealRow name="Energy Drink Co." amount="$3,500" status="pending" delay={0.9} />
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5, ease: easeOutExpo }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Monthly Earnings</h3>
                <span className="text-emerald-400 text-sm">+12% this month</span>
              </div>
              <MiniChart delay={0.8} />
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

type PageView = 'home' | 'cashflow';

export default function LiveDashboardPreview() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // Auto-cycle between pages every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(prev => prev === 'home' ? 'cashflow' : 'home');
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 mb-6">
            <Play size={14} />
            Interactive Preview
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            See it in action
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Explore the dashboard before you sign up. Click around, see the features, and imagine your NIL empire.
          </p>
        </motion.div>

        {/* Dashboard preview container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: easeOutExpo }}
          className="relative"
        >
          {/* Dashboard content - Live pages */}
          <div className="aspect-[16/9] bg-gradient-to-br from-black via-neutral-950 to-neutral-900 rounded-2xl overflow-hidden border border-white/10">
            <div className="w-full h-full overflow-hidden" style={{
              transform: 'scale(0.72)',
              transformOrigin: 'top left',
              width: '138.89%',
              height: '138.89%'
            }}>
              <AnimatePresence mode="wait">
                {currentPage === 'home' ? (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HomePage theme="dark" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="cashflow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CashFlowPage theme="dark" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Floating labels - Dynamic based on current page */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-label-${currentPage}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute -left-4 top-1/4 hidden lg:block"
            >
              <div className="bg-emerald-500 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
                {currentPage === 'home' ? 'Goal progress tracking' : 'Income vs expenses'}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`right-label-${currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute -right-4 top-1/2 hidden lg:block"
            >
              <div className="bg-purple-500 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
                {currentPage === 'home' ? 'Auto tax vault' : 'Spending insights'}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`bottom-label-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/4 -bottom-4 hidden lg:block"
            >
              <div className="bg-blue-500 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
                {currentPage === 'home' ? 'Active deals overview' : 'Monthly cash flow'}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors"
          >
            Get Your Own Dashboard
          </button>
        </motion.div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
          >
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="text-white font-semibold">Utility Financial - Dashboard Preview</span>
              </div>
              <div className="flex items-center gap-4">
                {/* Page Switcher */}
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      currentPage === 'home'
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setCurrentPage('cashflow')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      currentPage === 'cashflow'
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Cash Flow
                  </button>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Fullscreen Content */}
            <div className="flex-1 overflow-auto bg-gradient-to-br from-black via-neutral-950 to-neutral-900">
              <AnimatePresence mode="wait">
                {currentPage === 'home' ? (
                  <motion.div
                    key="home-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HomePage theme="dark" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="cashflow-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CashFlowPage theme="dark" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
