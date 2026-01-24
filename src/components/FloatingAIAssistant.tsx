import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Maximize2, Minimize2 } from 'lucide-react';
import { chat, checkOllamaStatus, generateSystemPrompt, Message } from '../services/ollama';

interface FloatingAIAssistantProps {
  userData: {
    name: string;
    totalEarned: number;
    taxVault: number;
    available: number;
    taxRate: number;
    recentTransactions: Array<{ description: string; amount: number; date: string; category: string }>;
    upcomingTasks?: Array<{ title: string; dueDate: string }>;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type ConversationTab = 'Tax Planning' | 'Deal Analysis' | 'Compliance Check' | 'Growth Strategy';

const tabs: ConversationTab[] = ['Tax Planning', 'Deal Analysis', 'Compliance Check', 'Growth Strategy'];

const suggestionsByTab: Record<ConversationTab, string[]> = {
  'Tax Planning': [
    'How much tax should I save?',
    'What deductions can I claim?',
    'When are my quarterly taxes due?'
  ],
  'Deal Analysis': [
    'Analyze my latest deal',
    'What deals are trending?',
    'How should I price my content?'
  ],
  'Compliance Check': [
    'Am I NCAA compliant?',
    'Can I accept this sponsorship?',
    'What are the latest NIL rules?'
  ],
  'Growth Strategy': [
    'How can I earn more?',
    'Build my personal brand',
    'Find more opportunities'
  ]
};

export function FloatingAIAssistant({ userData }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<ConversationTab>('Tax Planning');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check if Ollama is running on mount
  useEffect(() => {
    checkOllamaStatus().then(setOllamaAvailable);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSuggestionClick = async (suggestion: string) => {
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
    setIsLoading(true);

    try {
      const systemPrompt = generateSystemPrompt(userData);
      const apiMessages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content } as Message)),
        { role: 'user', content: suggestion }
      ];

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let fullResponse = '';
      await chat(
        apiMessages,
        'llama3.1:8b',
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: fullResponse
            };
            return newMessages;
          });
        }
      );

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: "I'm having trouble connecting to the AI service. Please make sure Ollama is running with the llama3.1:8b model installed."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    handleSuggestionClick(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Floating Button - Util Character */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center overflow-hidden group"
          style={{ animation: 'fadeIn 0.3s ease-in, float 3s ease-in-out infinite' }}
        >
          {/* Util Character - Animated */}
          <svg viewBox="0 0 100 100" className="w-14 h-14">
            {/* Neck */}
            <rect x="45" y="72" width="10" height="8" fill="#8B6F47" />
            
            {/* Head - rounder shape */}
            <ellipse cx="50" cy="52" rx="18" ry="20" fill="#8B6F47" />
            
            {/* Ears */}
            <ellipse cx="32" cy="52" rx="3" ry="5" fill="#6B5639" />
            <ellipse cx="68" cy="52" rx="3" ry="5" fill="#6B5639" />
            
            {/* Box Fade Hair - tall flat top */}
            <rect x="32" y="22" width="36" height="16" fill="#1a0f0a" rx="1" />
            {/* Top highlight */}
            <rect x="32" y="22" width="36" height="2" fill="#2a1f1a" />
            {/* Side fades */}
            <rect x="31" y="38" width="4" height="8" fill="#1a0f0a" opacity="0.8" />
            <rect x="65" y="38" width="4" height="8" fill="#1a0f0a" opacity="0.8" />
            {/* Hair texture lines */}
            <line x1="38" y1="22" x2="38" y2="25" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.3" />
            <line x1="44" y1="22" x2="44" y2="25" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.3" />
            <line x1="50" y1="22" x2="50" y2="25" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.3" />
            <line x1="56" y1="22" x2="56" y2="25" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.3" />
            <line x1="62" y1="22" x2="62" y2="25" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.3" />
            
            {/* Glasses frame */}
            <rect x="36" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
            <rect x="53" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
            {/* Bridge */}
            <line x1="47" y1="51" x2="53" y2="51" stroke="#1a1a1a" strokeWidth="2" />
            {/* Temples */}
            <line x1="36" y1="51" x2="32" y2="51" stroke="#1a1a1a" strokeWidth="1.5" />
            <line x1="64" y1="51" x2="68" y2="51" stroke="#1a1a1a" strokeWidth="1.5" />
            
            {/* Eyes behind glasses */}
            <ellipse cx="41.5" cy="51" rx="3" ry="3.5" fill="white" className="group-hover:animate-pulse" />
            <ellipse cx="58.5" cy="51" rx="3" ry="3.5" fill="white" className="group-hover:animate-pulse" />
            <circle cx="42" cy="51" r="2" fill="#1a1a1a" />
            <circle cx="59" cy="51" r="2" fill="#1a1a1a" />
            {/* Eye highlights */}
            <circle cx="42.5" cy="50.5" r="0.8" fill="white" opacity="0.8" />
            <circle cx="59.5" cy="50.5" r="0.8" fill="white" opacity="0.8" />
            
            {/* Nose */}
            <ellipse cx="50" cy="57" rx="2.5" ry="3" fill="#6B5639" />
            
            {/* Friendly smile */}
            <path d="M 40 62 Q 50 67 60 62" stroke="#4a3728" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 41 62.5 Q 50 66 59 62.5" fill="#8B6F47" stroke="none" />
            
            {/* Sparkle effect */}
            <circle cx="75" cy="28" r="2" fill="white" opacity="0.8" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="25" cy="40" r="1.5" fill="white" opacity="0.6" className="animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          </svg>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 z-50 flex flex-col shadow-2xl border border-slate-700/50 ${
            isFullScreen 
              ? 'inset-0' 
              : 'bottom-6 right-6 w-[500px] h-[700px] rounded-2xl'
          }`}
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b border-slate-700/50 flex-shrink-0 ${
            isFullScreen ? 'px-8 py-6' : 'px-5 py-4'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden shadow-lg ${
                isFullScreen ? 'h-14 w-14' : 'h-11 w-11'
              }`}>
                <svg viewBox="0 0 100 100" className={isFullScreen ? 'w-12 h-12' : 'w-9 h-9'}>
                  {/* Head */}
                  <ellipse cx="50" cy="52" rx="18" ry="20" fill="#8B6F47" />
                  
                  {/* Ears */}
                  <ellipse cx="32" cy="52" rx="3" ry="5" fill="#6B5639" />
                  <ellipse cx="68" cy="52" rx="3" ry="5" fill="#6B5639" />
                  
                  {/* Box Fade Hair */}
                  <rect x="32" y="22" width="36" height="16" fill="#1a0f0a" rx="1" />
                  <rect x="32" y="22" width="36" height="2" fill="#2a1f1a" />
                  
                  {/* Glasses */}
                  <rect x="36" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
                  <rect x="53" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
                  <line x1="47" y1="51" x2="53" y2="51" stroke="#1a1a1a" strokeWidth="2" />
                  
                  {/* Eyes */}
                  <ellipse cx="41.5" cy="51" rx="3" ry="3.5" fill="white" />
                  <ellipse cx="58.5" cy="51" rx="3" ry="3.5" fill="white" />
                  <circle cx="42" cy="51" r="2" fill="#1a1a1a" />
                  <circle cx="59" cy="51" r="2" fill="#1a1a1a" />
                  
                  {/* Smile */}
                  <path d="M 40 62 Q 50 67 60 62" stroke="#4a3728" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h2 className={`font-bold text-white ${isFullScreen ? 'text-2xl' : 'text-lg'}`}>Util</h2>
                <p className={`text-emerald-400 font-medium ${isFullScreen ? 'text-sm' : 'text-xs'}`}>
                  Always online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                title={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className={isFullScreen ? 'h-6 w-6' : 'h-5 w-5'} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex items-center gap-2 border-b border-slate-700/50 flex-shrink-0 overflow-x-auto ${
            isFullScreen ? 'px-8 py-4' : 'px-4 py-3'
          }`}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  isFullScreen ? 'text-sm' : 'text-xs'
                } ${
                  activeTab === tab
                    ? 'bg-slate-700 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto space-y-3 ${
            isFullScreen ? 'px-8 py-6 space-y-4' : 'px-4 py-4'
          }`} style={{ overscrollBehavior: 'contain' }}>
            {messages.length === 0 ? (
              <div className={`flex justify-start ${isFullScreen ? 'pt-4' : 'pt-2'}`}>
                <div className={`rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 ${
                  isFullScreen ? 'h-10 w-10 mr-3' : 'h-8 w-8 mr-2'
                }`}>
                  <svg viewBox="0 0 100 100" className={isFullScreen ? 'w-8 h-8' : 'w-6 h-6'}>
                    <ellipse cx="50" cy="52" rx="18" ry="20" fill="#8B6F47" />
                    <rect x="36" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
                    <rect x="53" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
                  </svg>
                </div>
                <div className={`bg-slate-800 text-slate-100 rounded-2xl ${
                  isFullScreen ? 'max-w-[70%] px-5 py-3.5' : 'max-w-[80%] px-4 py-2.5'
                }`}>
                  <p className={`whitespace-pre-wrap leading-relaxed ${isFullScreen ? 'text-base' : 'text-sm'}`}>
                    Hey {userData.name.split(' ')[0]}! I'm Util, your personal NIL assistant. I can help you with tax planning, deal analysis, compliance questions, and growth strategies. What's on your mind?
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className={`rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 ${
                        isFullScreen ? 'h-10 w-10 mr-3' : 'h-8 w-8 mr-2'
                      }`}>
                        <svg viewBox="0 0 100 100" className={isFullScreen ? 'w-8 h-8' : 'w-6 h-6'}>
                          <ellipse cx="50" cy="52" rx="18" ry="20" fill="#8B6F47" />
                          <rect x="36" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
                          <rect x="53" y="47" width="11" height="9" fill="none" stroke="#1a1a1a" strokeWidth="2" rx="2" />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl ${
                        isFullScreen ? 'max-w-[70%] px-5 py-3.5' : 'max-w-[80%] px-4 py-2.5'
                      } ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-100'
                      }`}
                    >
                      <p className={`whitespace-pre-wrap leading-relaxed ${isFullScreen ? 'text-base' : 'text-sm'}`}>
                        {message.content}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className={`rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 ${
                        isFullScreen ? 'h-10 w-10 ml-3' : 'h-8 w-8 ml-2'
                      }`}>
                        <svg className={`text-white ${isFullScreen ? 'w-6 h-6' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 ${
                      isFullScreen ? 'h-10 w-10 mr-3' : 'h-8 w-8 mr-2'
                    }`}>
                      <svg viewBox="0 0 100 100" className={isFullScreen ? 'w-8 h-8' : 'w-6 h-6'}>
                        <ellipse cx="50" cy="52" rx="18" ry="20" fill="#8B6F47" />
                      </svg>
                    </div>
                    <div className={`bg-slate-800 rounded-2xl ${isFullScreen ? 'px-5 py-3.5' : 'px-4 py-2.5'}`}>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Section - Suggestions & Input */}
          <div className={`border-t border-slate-700/50 flex-shrink-0 bg-slate-900/50 backdrop-blur-sm ${
            isFullScreen ? 'px-8 py-6' : 'px-4 py-4'
          }`}>
            {/* Suggestions */}
            <div className={isFullScreen ? 'mb-4' : 'mb-3'}>
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionsByTab[activeTab].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                    className={`bg-slate-800/70 hover:bg-slate-700 text-slate-200 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600/50 ${
                      isFullScreen ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about NIL..."
                  rows={1}
                  disabled={ollamaAvailable === false || isLoading}
                  className={`w-full bg-slate-800 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFullScreen ? 'px-5 py-3.5 text-base' : 'px-4 py-2.5 text-sm'
                  }`}
                  style={{ minHeight: isFullScreen ? '52px' : '42px', maxHeight: '120px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading || ollamaAvailable === false}
                className={`bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg hover:shadow-emerald-500/50 ${
                  isFullScreen ? 'p-3.5' : 'p-2.5'
                }`}
              >
                <Send className={isFullScreen ? 'h-6 w-6' : 'h-5 w-5'} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}
