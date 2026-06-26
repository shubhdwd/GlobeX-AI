import type { Request, Response, NextFunction } from 'express';
import { chatService } from './chat.service';
import { groqService } from './groq.service';
import { ChatMessageSchema } from './chat.schema';

export const chatController = {
  /**
   * POST /api/v1/chat
   * Send a message and get a complete AI response.
   */
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const t0 = performance.now();
      const dto = ChatMessageSchema.parse(req.body);
      const tAuthAndParse = performance.now() - t0;
      
      const tExpressStart = performance.now();
      // Ensure we hit the Python multi-agent architecture (chatService) to profile the agents
      const result = await chatService.chat(dto);
      const tAgentCall = performance.now() - tExpressStart;

      // Extract the python profile
      const pyProfile = (result as any).profile || {};
      
      console.log('\n' + '='.repeat(50));
      console.log('⚡ EMERGENCY PERFORMANCE PROFILE');
      console.log('='.repeat(50));
      console.log(`Frontend Request -> Express / Auth: ${tAuthAndParse.toFixed(2)} ms`);
      console.log(`Express Routing -> Agent Overhead : ${(tAgentCall - ((pyProfile['Intent Detection'] || 0) + (pyProfile['ChromaDB Retrieval'] || 0) + (pyProfile['Tool Calls'] || 0) + (pyProfile['LLM Call (Groq)'] || 0) + (pyProfile['Memory Update'] || 0))*1000).toFixed(2)} ms`);
      
      if (Object.keys(pyProfile).length > 0) {
        console.log(`Intent Detection: ${(pyProfile['Intent Detection'] * 1000).toFixed(2)} ms`);
        console.log(`ChromaDB Retrieval: ${(pyProfile['ChromaDB Retrieval'] * 1000).toFixed(2)} ms`);
        console.log(`Tool Calls (Buyer/Market/etc): ${(pyProfile['Tool Calls'] * 1000).toFixed(2)} ms`);
        console.log(`LLM Call (Groq): ${(pyProfile['LLM Call (Groq)'] * 1000).toFixed(2)} ms`);
        console.log(`Memory / Formatting: ${(pyProfile['Memory Update'] * 1000).toFixed(2)} ms`);
      }
      
      const totalTime = performance.now() - t0;
      console.log(`Total: ${(totalTime).toFixed(2)} ms`);
      console.log('='.repeat(50) + '\n');

      res.json({ success: true, data: result, profile: pyProfile });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/chat/stream
   * Stream the AI response as Server-Sent Events (SSE).
   */
  async chatStream(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = ChatMessageSchema.parse(req.body);
      const stream = await chatService.chatStream(dto);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders();

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(decoder.decode(value, { stream: true }));
          }
        } finally {
          res.end();
        }
      };

      pump().catch(next);

      // Clean up on client disconnect
      req.on('close', () => reader.cancel());
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/chat/sessions/:sessionId/history
   * Fetch conversation history for a session.
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const data = await chatService.getSessionHistory(sessionId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/v1/chat/sessions/:sessionId
   * Delete a session.
   */
  async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      await chatService.deleteSession(sessionId);
      res.json({ success: true, message: `Session ${sessionId} deleted` });
    } catch (err) {
      next(err);
    }
  },
};
