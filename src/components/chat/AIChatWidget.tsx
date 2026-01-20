import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Sparkles } from 'lucide-react';
import { chat, checkOllamaStatus, generateSystemPrompt, Message } from '../../services/ollama';

interface AIChatWidgetProps {
  onClose: () => void;
  userData: {
    name: string;
    totalEarned: number;
    taxVault: number;
    available: number;
    taxRate: number;
    recentTransactions: Array<{ description: string; amount: number; date: string; category: string }>;
    upcomingTasks?: Array<{ title: string; dueDate: string }>;
  };
  initialMessage?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatWidget({ onClose, userData, initialMessage }: AIChatWidgetProps) {
  console.log('🤖 AIChatWidget rendering with userData:', userData);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi ${userData.name.split(' ')[0]}! I'm your AI financial advisor. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-send initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 1) {
      sendMessage(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check if Ollama is running on mount
  useEffect(() => {
    checkOllamaStatus().then(setOllamaAvailable);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build messages array with system prompt
      const systemPrompt = generateSystemPrompt(userData);
      const apiMessages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content } as Message)),
        { role: 'user', content: userMessage }
      ];

      // Add placeholder for assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      // Stream the response
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
          content: "I'm having trouble connecting. Please make sure Ollama is running with: `ollama pull llama3.1:8b`"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 flex-shrink-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Financial Advisor</h3>
            <p className="text-xs text-neutral-400">
              {ollamaAvailable === false ? (
                <span className="text-amber-400">⚠ Ollama offline</span>
              ) : ollamaAvailable === true ? (
                <span className="text-emerald-400">● Online</span>
              ) : (
                <span>Connecting...</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Minimize2 className="h-4 w-4 text-neutral-400" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-100'
              }`}
            >
              <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 rounded-2xl px-3 py-2">
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
      <div className="px-4 py-3 border-t border-neutral-800 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            disabled={ollamaAvailable === false}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '36px', maxHeight: '80px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || ollamaAvailable === false}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-[10px] text-neutral-500 mt-1.5 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
