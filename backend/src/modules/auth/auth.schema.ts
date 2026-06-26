import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2).max(200),
  companyType: z.enum(['Manufacturer', 'Trader', 'MSME', 'Exporter', 'Distributor', 'Other']),
  industry: z.string().min(2).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  companyName: z.string().min(2).max(200).optional(),
  companyType: z.enum(['Manufacturer', 'Trader', 'MSME', 'Exporter', 'Distributor', 'Other']).optional(),
  industry: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  exportLicense: z.string().optional(),
  primaryMarket: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field required' });

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
