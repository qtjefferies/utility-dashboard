# AI Assistant Setup Guide

The athlete dashboard now includes an AI-powered financial advisor that uses a local Ollama model to provide personalized tax and financial guidance.

## Features

- **Context-Aware**: The AI knows your financial data including total earned, tax vault, available cash, recent transactions, and upcoming tasks
- **Financial Expertise**: Specialized in NIL (Name, Image, Likeness) income, tax planning, and financial strategies for college athletes
- **Privacy-First**: Runs completely locally on your machine - no data sent to external servers
- **Real-time Streaming**: Responses stream in real-time for a natural conversation experience

## Setup Instructions

### 1. Install Ollama

Download and install Ollama from: https://ollama.ai

**macOS/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download the installer from the Ollama website.

### 2. Install the Llama 3.1 Model

After installing Ollama, pull the recommended model:

```bash
ollama pull llama3.1:8b
```

This will download the Llama 3.1 8B parameter model (~4.7GB). This model provides:
- Fast response times (2-5 seconds on modern hardware)
- Strong reasoning capabilities for financial questions
- Good understanding of tax concepts and strategies

**Alternative Models:**

If you have more powerful hardware, you can use larger models for better quality:

```bash
# Llama 3.1 70B (requires ~40GB RAM, better quality)
ollama pull llama3.1:70b

# Mistral (alternative, ~4GB)
ollama pull mistral
```

To use a different model, update the default in `/src/services/ollama.ts`:
```typescript
export async function chat(
  messages: Message[],
  model: string = 'llama3.1:8b',  // Change this
  onChunk?: (content: string) => void
): Promise<string> {
```

### 3. Start Ollama Server

Ollama runs as a background service. Start it with:

```bash
ollama serve
```

The server runs on `http://localhost:11434` by default.

### 4. Verify Setup

You can verify Ollama is running with:

```bash
curl http://localhost:11434/api/tags
```

This should return a JSON list of installed models.

## Using the AI Assistant

1. **Open the Chat**: Click the "AI Assistant" button at the bottom of the sidebar (sparkle icon ✨)

2. **Ask Questions**: The AI can help with:
   - Tax planning and quarterly estimates
   - Expense deductions and record-keeping
   - Financial strategies for NIL income
   - Understanding tax brackets and rates
   - Savings recommendations
   - Questions about specific transactions

3. **Example Questions**:
   - "How much should I save for Q2 estimated taxes?"
   - "What expenses can I deduct from my NIL income?"
   - "Am I on track with my tax savings?"
   - "Should I set aside more or less for taxes?"
   - "What are the tax implications of this deal?"

4. **Context Provided**: The AI has access to:
   - Your total earned amount
   - Current tax vault balance
   - Available cash
   - Tax rate (28%)
   - Your 10 most recent transactions
   - Upcoming tax deadlines and tasks

## System Prompt

The AI is instructed to:
- Provide accurate tax and financial guidance for NIL athletes
- Reference your actual financial data when answering
- Explain complex concepts in simple terms
- Suggest actionable financial strategies
- Be encouraging and supportive
- Recommend consulting a CPA for complex situations

## Troubleshooting

### "Ollama not running" Warning

If you see this warning in the chat:
1. Make sure Ollama is installed
2. Start the Ollama server: `ollama serve`
3. Verify the model is installed: `ollama list`
4. Refresh the page

### Slow Responses

- **8B model**: Should respond in 2-5 seconds on modern hardware
- **70B model**: May take 10-30 seconds, requires powerful GPU/CPU
- Consider using the 8B model for faster responses

### Connection Errors

If the AI can't connect:
1. Check Ollama is running: `curl http://localhost:11434/api/tags`
2. Make sure no firewall is blocking port 11434
3. Check browser console (F12) for error messages

### Model Not Found

If you get a "model not found" error:
```bash
# List installed models
ollama list

# Install the model if missing
ollama pull llama3.1:8b
```

## Privacy & Security

- **100% Local**: All AI processing happens on your machine
- **No External Calls**: Your financial data never leaves your computer
- **No Logging**: Ollama doesn't log conversations by default
- **Open Source**: Both the dashboard and Ollama are open source

## Performance Tips

1. **GPU Acceleration**: Ollama automatically uses your GPU if available (NVIDIA/AMD/Apple Silicon)
2. **RAM Requirements**:
   - 8B model: ~8GB RAM minimum
   - 70B model: ~40GB RAM minimum
3. **Close Unused Apps**: Free up RAM for faster responses
4. **Keep Ollama Updated**: `ollama update`

## Technical Details

### API Integration

The AI Assistant uses:
- **Service**: `/src/services/ollama.ts` - Ollama API wrapper
- **Component**: `/src/components/modals/AIChatModal.tsx` - Chat UI
- **Endpoint**: `http://localhost:11434/api/chat`
- **Streaming**: Uses chunked responses for real-time display

### System Prompt Generation

The system prompt includes:
- User's name and financial summary
- Recent transaction history
- Upcoming tasks and deadlines
- Tax context and NIL-specific information

This is generated dynamically in `generateSystemPrompt()` in `/src/services/ollama.ts`.

## Customization

### Change the Model

Edit `/src/services/ollama.ts`:
```typescript
const DEFAULT_MODEL = 'llama3.1:8b'; // Change here
```

### Adjust System Prompt

Modify `generateSystemPrompt()` in `/src/services/ollama.ts` to customize:
- AI personality and tone
- Specific financial advice focus areas
- Context information provided

### Styling

The chat modal styling is in `/src/components/modals/AIChatModal.tsx` using Tailwind classes.

## Support

For issues with:
- **Ollama**: Visit https://github.com/ollama/ollama/issues
- **Dashboard**: Open an issue in this repository
- **Model Quality**: Try a larger model or adjust the system prompt

## Recommended Next Steps

1. Install Ollama and the llama3.1:8b model
2. Start the Ollama server
3. Click "AI Assistant" in the dashboard
4. Try asking: "How much should I save for taxes based on my current income?"

Enjoy your AI-powered financial advisor! 🚀
