import { z } from 'zod';

export const ChatMessageSchema = z.object({
  session_id: z.string().uuid().optional(),
  message: z.string().min(1).max(4000),
  source: z.string().optional(),
});

export type ChatMessageDto = z.infer<typeof ChatMessageSchema>;

export const ChatStreamSchema = z.object({
  session_id: z.string().uuid().optional(),
  message: z.string().min(1).max(4000),
  source: z.string().optional(),
});

export type ChatStreamDto = z.infer<typeof ChatStreamSchema>;
