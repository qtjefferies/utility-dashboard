import React, { useState, useRef, useEffect } from 'react';
import { X, Send, AlertCircle, Sparkles } from 'lucide-react';
import { chat, checkOllamaStatus, generateSystemPrompt, Message } from '../../services/ollama';

interface AIChatModalProps {
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
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatModal({ onClose, userData }: AIChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi ${userData.name.split(' ')[0]}! I'm your AI financial advisor. I can help you with tax questions, financial planning, and understanding your NIL income. What would you like to know?`
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
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
          content: "I'm having trouble connecting to the AI service. Please make sure Ollama is running with the llama3.1:8b model installed. You can install it by running: `ollama pull llama3.1:8b`"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Financial Advisor</h2>
              <p className="text-xs text-neutral-400">
                {ollamaAvailable === false ? (
                  <span className="text-amber-400">⚠ Ollama not detected</span>
                ) : ollamaAvailable === true ? (
                  <span className="text-emerald-400">● Connected to Llama 3.1</span>
                ) : (
                  <span>Checking connection...</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Connection Warning */}
        {ollamaAvailable === false && (
          <div className="mx-6 mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-200 font-medium mb-1">Ollama not running</p>
              <p className="text-amber-300/80 text-xs">
                Make sure Ollama is installed and running. Install the model with: <code className="bg-neutral-950 px-2 py-0.5 rounded">ollama pull llama3.1:8b</code>
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
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
              <div className="bg-neutral-800 rounded-2xl px-4 py-3">
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
        <div className="px-6 py-4 border-t border-neutral-800 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about taxes, savings, or financial advice..."
              rows={1}
              disabled={ollamaAvailable === false}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || ollamaAvailable === false}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="text-xs text-neutral-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
