import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle } from 'lucide-react';
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

const topQuestions = [
  { emoji: '❓', text: 'What deals are hot in my area?', query: "What NIL deals are hot in my area right now?" },
  { emoji: '🎯', text: 'Is this brand deal a good opportunity?', query: "I have a brand deal opportunity. Can you help me evaluate if it's a good opportunity?" },
  { emoji: '📸', text: 'How should I price Instagram posts?', query: "How should I price my Instagram posts for brand deals?" }
];

export function FloatingAIAssistant({ userData }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi ${userData.name.split(' ')[0]}! I'm your AI assistant. I can help you with NIL deals, tax questions, financial planning, and more. What would you like to know?`
    }
  ]);
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

  const handleQuestionClick = async (query: string) => {
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);

    try {
      const systemPrompt = generateSystemPrompt(userData);
      const apiMessages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content } as Message)),
        { role: 'user', content: query }
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
    handleQuestionClick(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center"
          style={{ animation: 'fadeIn 0.3s ease-in' }}
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* Slide-out Panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 h-[750px] w-[380px] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-50 flex flex-col"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <p className="text-xs text-neutral-400">
                  {ollamaAvailable === false ? (
                    <span className="text-amber-400">⚠ Ollama not detected</span>
                  ) : ollamaAvailable === true ? (
                    <span className="text-emerald-400">● Online</span>
                  ) : (
                    <span>Checking...</span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Top Questions Section */}
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950/50 flex-shrink-0">
            <h3 className="text-sm font-semibold text-neutral-300 mb-3">Top Questions to Ask</h3>
            <div className="space-y-2">
              {topQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(question.query)}
                  disabled={isLoading}
                  className="w-full text-left text-xs leading-snug text-neutral-200 py-2 px-2.5 bg-neutral-800/60 rounded-lg border border-neutral-700 hover:border-emerald-500/50 hover:bg-neutral-800 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-1.5">{question.emoji}</span>
                  <span className="inline-block w-[75%]">{question.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ overscrollBehavior: 'contain' }}>
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-800 text-neutral-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-neutral-800 flex-shrink-0 bg-neutral-950/50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                rows={1}
                disabled={ollamaAvailable === false || isLoading}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || ollamaAvailable === false}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Press Enter to send
            </p>
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
      `}</style>
    </>
  );
}
