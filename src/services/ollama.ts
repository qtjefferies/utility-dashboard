/**
 * Ollama API Service
 * Connects to local Ollama instance for AI chat
 */

const OLLAMA_API_URL = 'http://localhost:11434';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: Message[];
  stream?: boolean;
}

export interface ChatResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

/**
 * Send a chat request to Ollama
 */
export async function chat(
  messages: Message[],
  model: string = 'llama3.1:8b',
  onChunk?: (content: string) => void
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: !!onChunk,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    if (onChunk) {
      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data: ChatResponse = JSON.parse(line);
              if (data.message?.content) {
                fullContent += data.message.content;
                onChunk(data.message.content);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      return fullContent;
    } else {
      // Handle non-streaming response
      const data: ChatResponse = await response.json();
      return data.message.content;
    }
  } catch (error) {
    console.error('Ollama chat error:', error);
    throw error;
  }
}

/**
 * Check if Ollama is running and model is available
 */
export async function checkOllamaStatus(model: string = 'llama3.1:8b'): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    if (!response.ok) return false;

    const data = await response.json();
    return data.models?.some((m: any) => m.name.includes(model.split(':')[0]));
  } catch (error) {
    return false;
  }
}

/**
 * Generate system prompt with user context
 */
export function generateSystemPrompt(userData: {
  name: string;
  totalEarned: number;
  taxVault: number;
  available: number;
  taxRate: number;
  recentTransactions: Array<{ description: string; amount: number; date: string; category: string }>;
  upcomingTasks?: Array<{ title: string; dueDate: string }>;
}): string {
  return `You are a knowledgeable financial and tax advisor assistant for ${userData.name}, a college athlete managing NIL (Name, Image, Likeness) income.

## User's Financial Snapshot:
- Total Earned: $${userData.totalEarned.toLocaleString()}
- Tax Vault (saved for taxes): $${userData.taxVault.toLocaleString()}
- Available Cash: $${userData.available.toLocaleString()}
- Current Tax Rate: ${(userData.taxRate * 100).toFixed(0)}%

## Recent Transactions:
${userData.recentTransactions.slice(0, 5).map(tx =>
  `- ${tx.description}: ${tx.amount >= 0 ? '+' : ''}$${tx.amount.toLocaleString()} (${tx.category}, ${tx.date})`
).join('\n')}

${userData.upcomingTasks && userData.upcomingTasks.length > 0 ? `
## Upcoming Tasks:
${userData.upcomingTasks.map(task => `- ${task.title} (Due: ${task.dueDate})`).join('\n')}
` : ''}

## Your Role:
1. Provide accurate tax and financial guidance for college athletes with NIL income
2. Reference the user's actual financial data when answering questions
3. Explain complex tax concepts in simple, understandable terms
4. Suggest actionable financial strategies based on their situation
5. Help with quarterly tax estimates, deductions, and compliance
6. Be encouraging and supportive about their financial journey

## Important Tax Knowledge:
- NIL income is self-employment income subject to federal, state, and self-employment taxes
- Quarterly estimated tax payments are required (April 15, June 15, Sept 15, Jan 15)
- Standard deductions for self-employed: business expenses, home office, equipment, travel
- Self-employment tax is 15.3% (Social Security + Medicare)
- State tax varies by location
- Importance of keeping receipts and documentation

Always be helpful, concise, and financially prudent. When you don't know something specific about tax law, acknowledge it and suggest consulting with a CPA.`;
}
