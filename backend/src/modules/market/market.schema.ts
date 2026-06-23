import { z } from 'zod';

export const analyzeMarketSchema = z.object({
  product: z.string().min(2).max(200),
  productId: z.string().uuid().optional(),
  targetRegions: z.array(z.string()).optional(), // e.g. ["Europe", "Southeast Asia"]
});

export type AnalyzeMarketDto = z.infer<typeof analyzeMarketSchema>;
