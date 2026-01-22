import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
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

const benefits = [
  {
    icon: Zap,
    title: 'Early Access',
    description: 'Be among the first athletes to use the platform',
  },
  {
    icon: Shield,
    title: 'Free Forever',
    description: 'Lock in free access as a founding member',
  },
  {
    icon: TrendingUp,
    title: 'Shape the Product',
    description: 'Your feedback directly influences our roadmap',
  },
];

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // TODO: Integrate with email service (Mailchimp, ConvertKit, Supabase, etc.)
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Waitlist signup:', email);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <section id="signup" className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 max-w-6xl mx-auto px-6"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
              <Sparkles size={16} />
              Join the Waitlist
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Get Early Access
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Be the first to know when we launch. Join thousands of athletes already on the waitlist.
          </motion.p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Benefits */}
          <motion.div variants={itemVariants} className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: easeOutExpo }}
                className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <benefit.icon className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-white/60">{benefit.description}</p>
                </div>
              </motion.div>
            ))}

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-4 pt-4"
            >
              {/* Avatar stack */}
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-black flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm">
                <span className="text-white font-semibold">2,400+</span> athletes already signed up
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Signup form */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            {/* Card glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl" />

            {/* Card */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl border border-white/10 p-8 md:p-10">
              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Reserve your spot
                  </h3>
                  <p className="text-white/60 mb-8">
                    Enter your email to join the waitlist. No spam, ever.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        required
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Join the Waitlist</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <Shield size={16} />
                      <span>Privacy protected</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <Check size={16} />
                      <span>Unsubscribe anytime</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Success state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center"
                  >
                    <Check className="text-emerald-400" size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    You're on the list!
                  </h3>
                  <p className="text-white/60 mb-6">
                    We'll send you an email when it's your turn to join.
                  </p>
                  <p className="text-emerald-400 text-sm font-medium">
                    Position #2,847 in line
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
