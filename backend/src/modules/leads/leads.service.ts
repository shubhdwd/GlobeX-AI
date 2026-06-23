import { LeadStatus } from '../../types/prisma';
import { leadsRepository } from './leads.repository';
import { leadScoringAgent } from '../agents/LeadScoringAgent';
import { AppError } from '../../middleware/error.middleware';
import type { CreateLeadDto, UpdateLeadDto } from './leads.schema';

export const leadsService = {
  async create(userId: string, dto: CreateLeadDto) {
    const aiScore = await leadScoringAgent.score({ buyerId: dto.buyerId, userId });
    return leadsRepository.create({
      buyer: { connect: { id: dto.buyerId } },
      user: { connect: { id: userId } },
      ...(dto.productId && { product: { connect: { id: dto.productId } } }),
      leadScore: aiScore,
      notes: dto.notes,
      nextAction: dto.nextAction,
      nextActionAt: dto.nextActionAt ? new Date(dto.nextActionAt) : undefined,
    });
  },

  async getAll(userId: string, status?: LeadStatus) {
    return leadsRepository.findByUser(userId, status);
  },

  async update(id: string, userId: string, dto: UpdateLeadDto) {
    const lead = await leadsRepository.findById(id, userId);
    if (!lead) throw new AppError('Lead not found', 404);
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.status === LeadStatus.CONVERTED) updateData.convertedAt = new Date();
    if (dto.nextActionAt) updateData.nextActionAt = new Date(dto.nextActionAt as string);
    return leadsRepository.update(id, updateData);
  },

  async delete(id: string, userId: string) {
    const lead = await leadsRepository.findById(id, userId);
    if (!lead) throw new AppError('Lead not found', 404);
    await leadsRepository.delete(id);
  },

  async getStats(userId: string) {
    return leadsRepository.stats(userId);
  },
};
