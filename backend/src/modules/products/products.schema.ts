import { z } from 'zod';

export const createProductSchema = z.object({
  productName: z.string().min(2).max(200),
  category: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  hsCode: z.string().optional(),
  targetCountries: z.array(z.string().length(2)).min(1).max(50),
  unitPrice: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  certifications: z.array(z.string()).default([]),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
