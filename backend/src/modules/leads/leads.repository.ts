import { prisma } from '../../config/database';
import { LeadStatus } from '../../types/prisma';

export const leadsRepository = {
  create: (data: Parameters<typeof prisma.lead.create>[0]['data']) =>
    prisma.lead.create({ data, include: { buyer: true, product: { select: { productName: true } } } }),

  findByUser: (userId: string, status?: LeadStatus) =>
    prisma.lead.findMany({
      where: { userId, ...(status && { status }) },
      include: {
        buyer: { select: { companyName: true, country: true, leadScore: true } },
        product: { select: { productName: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string, userId: string) =>
    prisma.lead.findFirst({ where: { id, userId }, include: { buyer: true, product: true } }),

  update: (id: string, data: Parameters<typeof prisma.lead.update>[0]['data']) =>
    prisma.lead.update({ where: { id }, data }),

  delete: (id: string) => prisma.lead.delete({ where: { id } }),

  stats: (userId: string) =>
    prisma.lead.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true },
      _avg: { leadScore: true },
    }),
};
