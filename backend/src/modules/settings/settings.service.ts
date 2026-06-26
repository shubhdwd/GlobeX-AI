import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';

export const settingsService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
      }
    });
    if (!user) throw new AppError('User not found', 404);
    
    // Split name for frontend convenience
    const parts = user.name.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  },

  async updateProfile(userId: string, data: any) {
    let name = undefined;
    if (data.firstName !== undefined || data.lastName !== undefined) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const parts = user?.name.split(' ') || [];
      const first = data.firstName !== undefined ? data.firstName : parts[0] || '';
      const last = data.lastName !== undefined ? data.lastName : parts.slice(1).join(' ') || '';
      name = `${first} ${last}`.trim();
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(data.email && { email: data.email }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
      }
    });

    const parts = updated.name.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: updated.email,
      avatarUrl: updated.avatarUrl,
      role: updated.role,
    };
  },

  async getCompany(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        companyName: true,
        industry: true,
        gstTaxId: true,
        website: true,
        country: true,
        address: true,
        phoneNumber: true,
      }
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
  },

  async updateCompany(userId: string, data: any) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        companyName: true,
        industry: true,
        gstTaxId: true,
        website: true,
        country: true,
        address: true,
        phoneNumber: true,
      }
    });
  },

  async getNotifications(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true }
    });
    if (!user) throw new AppError('User not found', 404);
    
    const defaultPrefs = {
      emailNotifications: true,
      productUpdates: true,
      marketAlerts: true,
      buyerAlerts: true,
      complianceAlerts: true,
      weeklyReports: false,
    };

    return user.notificationPreferences || defaultPrefs;
  },

  async updateNotifications(userId: string, data: any) {
    const currentPrefs = await this.getNotifications(userId);
    const updatedPrefs = { ...(currentPrefs as any), ...data };
    
    await prisma.user.update({
      where: { id: userId },
      data: { notificationPreferences: updatedPrefs }
    });
    
    return updatedPrefs;
  },

  async changePassword(userId: string, { currentPassword, newPassword }: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new AppError('Invalid current password', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    return { success: true };
  },

  async getApiKeys(userId: string) {
    return await prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        lastUsed: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createApiKey(userId: string, name: string) {
    // Generate a secure API key
    const rawKey = 'glbx_' + crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        name,
        keyHash,
      }
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      rawKey, // Only returned once!
      createdAt: apiKey.createdAt,
    };
  },

  async deleteApiKey(userId: string, keyId: string) {
    const apiKey = await prisma.apiKey.findFirst({
      where: { id: keyId, userId }
    });
    if (!apiKey) throw new AppError('API key not found', 404);

    await prisma.apiKey.delete({ where: { id: keyId } });
    return { success: true };
  }
};
