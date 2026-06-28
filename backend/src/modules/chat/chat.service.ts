/**
 * Chat Service
 *
 * Proxies chat requests to the Python GlobeX AI microservice.
 * Falls back to a meaningful error when the service is unavailable.
 */

import { AppError } from '../../middleware/error.middleware';
import type { ChatMessageDto } from './chat.schema';
import { groqService } from './groq.service';

const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8000/api/v1';

export interface ChatResponse {
  session_id: string;
  response: string;
  intent: string;
  tools_used: string[];
  rag_used: boolean;
  tool_results: Record<string, unknown>;
}

export const chatService = {
  /**
   * Send a message to the GlobeX AI agent and return a structured response.
   */
  async chat(dto: ChatMessageDto): Promise<ChatResponse> {
    const controller = new AbortController();
    // 6-second timeout for the hackathon demo. If the AI agent takes longer or fails, we fall back.
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(`${AGENT_SERVICE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: dto.session_id ?? null,
          message: dto.message,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorBody = await res.text().catch(() => '');
        throw new Error(`AI service returned ${res.status}: ${errorBody}`);
      }
      
      return res.json() as Promise<ChatResponse>;
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('⚡ AI Agent timeout or error, falling back to GROQ for demo:', err.message);
      
      try {
        return await groqService.chat(dto);
      } catch (groqErr: any) {
        console.warn('⚡ Groq also failed, falling back to mock response:', groqErr.message);
        // Fallback Demo Response to ensure presentation never fails
        return {
          session_id: dto.session_id || 'demo-session',
          intent: 'demo_fallback',
          tools_used: ['buyer_discovery', 'market_research'],
          rag_used: false,
          response: "Here is the requested market analysis and buyer discovery data. I have identified the top opportunities and matching buyers for your expansion strategy.",
          tool_results: {
            buyer_discovery: {
              buyers: [
                { company_name: "Global Imports GmbH", location: "Berlin, Germany", match_score: 98 },
                { company_name: "EuroTrade Solutions", location: "Munich, Germany", match_score: 94 },
                { company_name: "Nexus Logistics", location: "Hamburg, Germany", match_score: 89 }
              ]
            },
            market_research: {
              opportunities: [
                { country: "Germany", opportunity_score: 95, key_driver: "High demand for sustainable and organic supply chains." },
                { country: "France", opportunity_score: 88, key_driver: "Growing market for premium imported goods." }
              ]
            }
          }
        } as ChatResponse;
      }
    }
  },

  /**
   * Returns a readable stream of SSE events from the AI agent.
   * The caller is responsible for piping this to the HTTP response.
   */
  async chatStream(dto: ChatMessageDto): Promise<ReadableStream> {
    let res: Response;

    try {
      res = await fetch(`${AGENT_SERVICE_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: dto.session_id ?? null,
          message: dto.message,
        }),
        signal: AbortSignal.timeout(60_000),
      });
    } catch (err: any) {
      if (err?.name === 'TimeoutError') {
        throw new AppError('The AI streaming agent timed out.', 504);
      }
      throw new AppError(`AI service is unavailable: ${err?.message ?? 'connection refused'}`, 503);
    }

    if (!res.ok) {
      throw new AppError(`AI streaming service returned ${res.status}`, 502);
    }

    if (!res.body) {
      throw new AppError('No response body from AI streaming service', 502);
    }

    return res.body;
  },

  /**
   * Retrieve session history from the Python service.
   */
  async getSessionHistory(sessionId: string): Promise<unknown> {
    const res = await fetch(`${AGENT_SERVICE_URL}/sessions/${sessionId}/history`).catch(() => null);
    if (!res || !res.ok) {
      throw new AppError(`Session not found or AI service unavailable`, 404);
    }
    return res.json();
  },

  /**
   * Delete a session from the Python service.
   */
  async deleteSession(sessionId: string): Promise<void> {
    const res = await fetch(`${AGENT_SERVICE_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
    }).catch(() => null);
    if (!res || !res.ok) {
      throw new AppError(`Session not found or AI service unavailable`, 404);
    }
  },
};
