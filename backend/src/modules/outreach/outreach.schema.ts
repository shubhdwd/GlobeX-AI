import { z } from 'zod';

export const generateOutreachSchema = z.object({
  buyerId: z.string().uuid(),
  tone: z.enum(['professional', 'friendly', 'formal']).default('professional'),
  language: z.string().length(2).default('en'),
  productId: z.string().uuid().optional(),
  customContext: z.string().max(500).optional(),
});

export type GenerateOutreachDto = z.infer<typeof generateOutreachSchema>;
