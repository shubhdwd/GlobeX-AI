import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().optional(),
});

export const CompanyUpdateSchema = z.object({
  companyName: z.string().optional(),
  industry: z.string().optional(),
  gstTaxId: z.string().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const NotificationsUpdateSchema = z.object({
  emailNotifications: z.boolean().optional(),
  productUpdates: z.boolean().optional(),
  marketAlerts: z.boolean().optional(),
  buyerAlerts: z.boolean().optional(),
  complianceAlerts: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
});

export const SecurityUpdateSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const ApiKeyCreateSchema = z.object({
  name: z.string().min(1).max(50),
});
