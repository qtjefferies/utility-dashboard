import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User } from 'lucide-react';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Custom sparkle icon to match the design
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M19 15L19.5 17L21.5 17.5L19.5 18L19 20L18.5 18L16.5 17.5L18.5 17L19 15Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M5 2L5.5 4L7.5 4.5L5.5 5L5 7L4.5 5L2.5 4.5L4.5 4L5 2Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DemoConversation {
  id: string;
  title: string;
  messages: Message[];
}

const demoConversations: DemoConversation[] = [
  {
    id: 'tax',
    title: 'Tax Planning',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'How much should I be saving for taxes?',
      },
      {
        id: '2',
        role: 'assistant',
        content:
          "Based on your $47,230 in NIL income this year, I recommend saving 28% for taxes—that's about $13,224. Your Tax Vault currently has $13,224, so you're right on track! Would you like me to set up automatic transfers when new payments come in?",
      },
    ],
  },
  {
    id: 'deals',
    title: 'Deal Analysis',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Is the Nike offer I got a good deal?',
      },
      {
        id: '2',
        role: 'assistant',
        content:
          "Looking at your Nike offer for $15,000, it's 25% above the average for athletes in your sport and follower range. The terms look standard—12-month exclusivity in athletic footwear. I'd suggest negotiating for social media usage rights. Want me to draft a counter-proposal?",
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance Check',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Is my new sponsorship deal compliant?',
      },
      {
        id: '2',
        role: 'assistant',
        content:
          "I've reviewed your Energy Drink Co. deal against NCAA rules and your school's policies. ✅ All clear! Just two quick things: 1) Make sure to disclose the partnership in social posts with #ad, and 2) Submit the contract to your compliance office within 7 days. Want me to set a reminder?",
      },
    ],
  },
  {
    id: 'growth',
    title: 'Growth Strategy',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'How can I increase my NIL earnings?',
      },
      {
        id: '2',
        role: 'assistant',
        content:
          "Based on your profile, here are my top 3 recommendations:\n\n1. **Grow TikTok** - Athletes with 50K+ followers earn 3x more. You're at 32K.\n\n2. **Local businesses** - Your area has 15 auto dealerships without athlete partners.\n\n3. **Camp appearances** - Summer camps pay $500-2K per session.\n\nWant me to create an outreach list for local businesses?",
      },
    ],
  },
];

const suggestedQuestions = [
  'How much tax should I save?',
  'Analyze my latest deal',
  'Am I NCAA compliant?',
  'How can I earn more?',
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
        <SparkleIcon className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 bg-gray-700/80 rounded-2xl rounded-tl-md px-5 py-4">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-400"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-emerald-400"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-emerald-400"
        />
      </div>
    </div>
  );
}

function ChatMessage({ message, isNew }: { message: Message; isNew: boolean }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-500'
            : 'bg-emerald-500'
        }`}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <SparkleIcon className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[85%] px-5 py-4 ${
          isUser
            ? 'bg-blue-500 text-white rounded-2xl rounded-tr-md'
            : 'bg-gray-700/80 text-white rounded-2xl rounded-tl-md'
        }`}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-line">{message.content}</p>
      </div>
    </motion.div>
  );
}

export default function AIAssistantPreview() {
  const [activeConversation, setActiveConversation] = useState<DemoConversation>(
    demoConversations[0]
  );
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-cycle through conversations
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setActiveConversation((prev) => {
        const currentIndex = demoConversations.findIndex((conv) => conv.id === prev.id);
        const nextIndex = (currentIndex + 1) % demoConversations.length;
        return demoConversations[nextIndex];
      });
      setRefreshKey((prev) => prev + 1);
    }, 10000); // Change conversation every 10 seconds

    return () => clearInterval(cycleInterval);
  }, []);

  // Simulate conversation playback
  useEffect(() => {
    setDisplayedMessages([]);
    setIsTyping(false);

    const messages = activeConversation.messages;
    let currentIndex = 0;

    const showNextMessage = () => {
      if (currentIndex >= messages.length) return;

      const message = messages[currentIndex];

      if (message.role === 'assistant') {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setDisplayedMessages((prev) => [...prev, message]);
          currentIndex++;
          setTimeout(showNextMessage, 1000);
        }, 1500);
      } else {
        setDisplayedMessages((prev) => [...prev, message]);
        currentIndex++;
        setTimeout(showNextMessage, 800);
      }
    };

    const timer = setTimeout(showNextMessage, 500);
    return () => clearTimeout(timer);
  }, [activeConversation, refreshKey]);

  const handleQuestionClick = (question: string) => {
    // Find matching conversation
    const matching = demoConversations.find((conv) =>
      conv.messages[0].content.toLowerCase().includes(question.toLowerCase().slice(0, 10))
    );
    if (matching) {
      setActiveConversation(matching);
    }
    setInputValue('');
  };

  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 mb-6">
              <SparkleIcon className="w-4 h-4" />
              AI-Powered Assistant
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your personal{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NIL advisor
              </span>
            </h2>

            <p className="text-xl text-white/60 mb-8">
              Get instant answers about taxes, deal analysis, compliance, and growth
              strategies. Like having a financial advisor in your pocket, 24/7.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {[
                'Personalized tax recommendations',
                'Real-time deal analysis',
                'Compliance monitoring',
                'Growth strategy insights',
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-white/80">{feature}</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() =>
                document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105"
            >
              Try It Free
            </button>
          </motion.div>

          {/* Right: Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: easeOutExpo }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl" />

            {/* Chat window */}
            <div className="relative bg-[#1a1f2e] rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl" style={{ minWidth: '650px' }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <SparkleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">NIL Assistant</h3>
                  <p className="text-emerald-400 text-sm">Always online</p>
                </div>
              </div>

              {/* Conversation tabs */}
              <div className="flex gap-3 px-6 py-4 border-b border-gray-700/30 overflow-x-auto">
                {demoConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeConversation.id === conv.id
                        ? 'bg-gray-700/80 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {conv.title}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="h-[340px] overflow-y-auto px-6 py-6 space-y-5">
                <AnimatePresence mode="wait">
                  {displayedMessages.map((msg, i) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      isNew={i === displayedMessages.length - 1}
                    />
                  ))}
                </AnimatePresence>
                {isTyping && <TypingIndicator />}
              </div>

              {/* Suggested questions */}
              <div className="px-6 py-4 border-t border-gray-700/30">
                <p className="text-gray-500 text-sm mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuestionClick(q)}
                      className="px-4 py-2 rounded-full bg-gray-700/50 text-gray-300 text-sm hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-gray-700/30">
                <div className="flex items-center gap-3 bg-gray-800/80 rounded-2xl px-5 py-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about NIL..."
                    className="flex-1 bg-transparent text-white placeholder:text-gray-500 text-[15px] focus:outline-none"
                  />
                  <button className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors">
                    <Send size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
