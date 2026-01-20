import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, Shield, TrendingUp, DollarSign, Building2, Zap } from 'lucide-react';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ============================================
// DEAL PIPELINE VISUAL
// ============================================
const deals = [
  { brand: 'Nike', amount: '$12,500', status: 'Active', color: 'bg-emerald-500' },
  { brand: 'Gatorade', amount: '$8,000', status: 'Pending', color: 'bg-amber-500' },
  { brand: 'Local Dealership', amount: '$3,200', status: 'Active', color: 'bg-emerald-500' },
  { brand: 'Supplement Co', amount: '$5,000', status: 'Draft', color: 'bg-gray-500' },
];

export function DealPipelineVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        {deals.map((deal, index) => (
          <motion.div
            key={deal.brand}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.2,
              duration: 0.6,
              ease: easeOutExpo,
            }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{deal.brand}</p>
                  <p className="text-white/50 text-xs">{deal.amount}</p>
                </div>
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.4, ease: easeOutExpo }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${deal.color}`}
              >
                {deal.status}
              </motion.span>
            </div>
          </motion.div>
        ))}

        {/* Floating notification */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, ease: easeOutExpo }}
          className="absolute -top-2 -right-2 bg-emerald-500 text-white px-3 py-2 rounded-lg shadow-lg shadow-emerald-500/30 text-xs font-medium flex items-center gap-2"
        >
          <Zap className="w-3 h-3" />
          New deal received!
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// TAX VAULT VISUAL
// ============================================
export function TaxVaultVisual() {
  const [percentage, setPercentage] = useState(0);
  const targetPercentage = 28;
  const [amount, setAmount] = useState(0);
  const targetAmount = 14250;

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setPercentage((prev) => {
          if (prev >= targetPercentage) {
            clearInterval(interval);
            return targetPercentage;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAmount((prev) => {
          if (prev >= targetAmount) {
            clearInterval(interval);
            return targetAmount;
          }
          return prev + 285;
        });
      }, 30);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-xs">
        {/* Vault container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          {/* Vault icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <DollarSign className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-white/50 text-sm mb-1">Tax Vault Balance</p>
            <p className="text-3xl font-bold text-white">
              ${amount.toLocaleString()}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span>Auto-saved</span>
              <span>{percentage}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: easeOutExpo }}
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
              />
            </div>
          </div>

          {/* Recent deposits */}
          <div className="space-y-2">
            {[
              { label: 'Nike payment', amount: '+$3,500' },
              { label: 'Gatorade payment', amount: '+$2,240' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.4, ease: easeOutExpo }}
                className="flex justify-between text-sm"
              >
                <span className="text-white/50">{item.label}</span>
                <span className="text-emerald-400 font-medium">{item.amount}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-20, -80],
              x: [0, (i - 2) * 15],
            }}
            transition={{
              delay: 0.8 + i * 0.3,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="absolute left-1/2 bottom-1/3 w-2 h-2 rounded-full bg-emerald-400"
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPLIANCE SHIELD VISUAL
// ============================================
const complianceItems = [
  { label: 'NCAA Disclosure Filed', checked: true },
  { label: 'State Registration', checked: true },
  { label: 'School Approval', checked: true },
  { label: 'Contract Review', checked: false },
];

export function ComplianceShieldVisual() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    complianceItems.forEach((item, index) => {
      if (item.checked) {
        setTimeout(() => {
          setCheckedItems((prev) => {
            const next = [...prev];
            next[index] = true;
            return next;
          });
        }, 600 + index * 400);
      }
    });
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-xs">
        {/* Shield */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(251, 146, 60, 0)',
                  '0 0 0 20px rgba(251, 146, 60, 0.1)',
                  '0 0 0 40px rgba(251, 146, 60, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Checklist */}
        <div className="space-y-3">
          {complianceItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4, ease: easeOutExpo }}
              className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: checkedItems[index] ? 1 : 0.8 }}
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  checkedItems[index] ? 'bg-emerald-500' : 'bg-white/10'
                }`}
              >
                {checkedItems[index] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
              <span className={`text-sm ${checkedItems[index] ? 'text-white' : 'text-white/50'}`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// LEGACY BUILDER VISUAL
// ============================================
export function LegacyBuilderVisual() {
  const [earnings, setEarnings] = useState(0);
  const targetEarnings = 127500;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = targetEarnings / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= targetEarnings) {
          setEarnings(targetEarnings);
          clearInterval(interval);
        } else {
          setEarnings(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Chart data points
  const chartPoints = [20, 35, 30, 50, 45, 65, 60, 85, 80, 100];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/50 text-sm">Lifetime Earnings</p>
              <p className="text-2xl font-bold text-white">
                ${earnings.toLocaleString()}
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center"
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          {/* Animated chart */}
          <div className="h-32 flex items-end gap-1.5">
            {chartPoints.map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.6,
                  ease: easeOutExpo,
                }}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-rose-500/50 to-pink-400"
              />
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
            {[
              { label: 'Deals', value: '12' },
              { label: 'Brands', value: '8' },
              { label: 'Growth', value: '+34%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.4, ease: easeOutExpo }}
                className="text-center"
              >
                <p className="text-white font-semibold">{stat.value}</p>
                <p className="text-white/40 text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5, ease: easeOutExpo }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-pink-500/30"
        >
          Top 5% of Athletes
        </motion.div>
      </div>
    </div>
  );
}
