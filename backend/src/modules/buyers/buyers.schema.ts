import { z } from 'zod';

export const buyerSearchSchema = z.object({
  q: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
  minLeadScore: z.string().transform(Number).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  sortBy: z.enum(['leadScore', 'companyName', 'createdAt']).default('leadScore'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

export type BuyerSearchDto = z.infer<typeof buyerSearchSchema>;
