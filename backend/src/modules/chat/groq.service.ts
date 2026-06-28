import { AppError } from '../../middleware/error.middleware';
import type { ChatMessageDto } from './chat.schema';
import type { ChatResponse } from './chat.service';

// Trigger nodemon restart to load latest .env variables

export const groqService = {
  /**
   * Send a message to Groq API and return a structured response mimicking the Python AI agent.
   */
  async chat(dto: ChatMessageDto): Promise<ChatResponse> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new AppError('GROQ_API_KEY is not configured on the server.', 500);
    }

    const primaryModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    const fallbackModel = 'mixtral-8x7b-32768';

    const makeGroqRequest = async (model: string) => {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are the GlobeX AI Copilot, a fast and highly intelligent international trade assistant. You provide concise, insightful, and well-structured answers formatted in markdown. Focus on international trade, market analysis, and global supply chains.'
            },
            {
              role: 'user',
              content: dto.message
            }
          ],
          temperature: 0.3,
          max_tokens: 1024
        }),
        signal: AbortSignal.timeout(10_000) // Fast timeout for Groq
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`[${response.status}] ${errorBody}`);
      }
      return response;
    };

    try {
      let response;
      try {
        response = await makeGroqRequest(primaryModel);
      } catch (err: any) {
        console.warn(`Primary Groq model (${primaryModel}) failed: ${err.message}. Falling back to ${fallbackModel}...`);
        response = await makeGroqRequest(fallbackModel);
      }

      const data: any = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'No response from Groq API.';

      return {
        session_id: dto.session_id || 'groq-session',
        response: aiResponse,
        intent: 'general_trade_query',
        tools_used: [],
        rag_used: false,
        tool_results: {}
      };
    } catch (err: any) {
      console.error('Groq service error:', err.message);
      
      let friendlyMessage = 'The AI Copilot is currently unavailable. Please try again in a moment.';
      
      if (err?.name === 'TimeoutError') {
        friendlyMessage = 'The AI Copilot took too long to respond. Please try again.';
      } else if (err.message.includes('[429]')) {
        friendlyMessage = 'The AI Copilot is experiencing high demand. Please wait a few seconds and try again.';
      } else if (err.message.includes('[401]') || err.message.includes('[403]')) {
        friendlyMessage = 'There is an issue with the AI Copilot configuration. Please contact support.';
      } else if (err.message.includes('[404]') || err.message.includes('model')) {
        friendlyMessage = 'The selected AI model is currently unavailable or deprecated.';
      }

      throw new AppError(friendlyMessage, 503);
    }
  }
};
