import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { chatController } from './chat.controller';

export const chatRoutes = Router();

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Send a message to GlobeX AI
 *     description: |
 *       Sends a user message to the GlobeX AI agent. The agent:
 *       - Classifies intent
 *       - Retrieves relevant RAG context
 *       - Calls trade tools if needed (HS code, duty, country rules, invoice, packing list)
 *       - Returns a structured, personalised response
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               session_id:
 *                 type: string
 *                 format: uuid
 *                 description: Existing session ID. Omit to start a new session.
 *               message:
 *                 type: string
 *                 maxLength: 4000
 *                 description: The user's message
 *     responses:
 *       200:
 *         description: AI agent response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     session_id: { type: string }
 *                     response: { type: string }
 *                     intent: { type: string }
 *                     tools_used: { type: array, items: { type: string } }
 *                     rag_used: { type: boolean }
 *                     tool_results: { type: object }
 *       503:
 *         description: AI service unavailable
 */
chatRoutes.post('/', authenticate, chatController.chat);

/**
 * @swagger
 * /chat/stream:
 *   post:
 *     summary: Stream an AI response (Server-Sent Events)
 *     description: Returns the AI agent response as a token-by-token SSE stream.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               session_id:
 *                 type: string
 *                 format: uuid
 *               message:
 *                 type: string
 *                 maxLength: 4000
 *     responses:
 *       200:
 *         description: Server-sent events stream
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */
chatRoutes.post('/stream', authenticate, chatController.chatStream);

/**
 * @swagger
 * /chat/sessions/{sessionId}/history:
 *   get:
 *     summary: Get conversation history for a session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation history
 */
chatRoutes.get('/sessions/:sessionId/history', authenticate, chatController.getHistory);

/**
 * @swagger
 * /chat/sessions/{sessionId}:
 *   delete:
 *     summary: Delete a chat session
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted
 */
chatRoutes.delete('/sessions/:sessionId', authenticate, chatController.deleteSession);
