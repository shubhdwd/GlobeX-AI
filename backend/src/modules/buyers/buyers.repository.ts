import { prisma } from '../../config/database';

export const buyersRepository = {
  search: async (params: {
    q?: string; country?: string; industry?: string; minLeadScore?: number;
    skip: number; take: number; orderBy: Record<string, string>;
  }) => {
    const where: {
      OR?: object[]; countryCode?: string;
      industry?: { contains: string; mode: 'insensitive' };
      leadScore?: { gte: number };
    } = {
      ...(params.q && { OR: [
        { companyName: { contains: params.q, mode: 'insensitive' } },
        { industry: { contains: params.q, mode: 'insensitive' } },
        { country: { contains: params.q, mode: 'insensitive' } },
      ]}),
      ...(params.country && { countryCode: params.country.toUpperCase() }),
      ...(params.industry && { industry: { contains: params.industry, mode: 'insensitive' } }),
      ...(params.minLeadScore && { leadScore: { gte: params.minLeadScore } }),
    };
    const [buyers, total] = await prisma.$transaction([
      prisma.buyer.findMany({ where, skip: params.skip, take: params.take, orderBy: params.orderBy }),
      prisma.buyer.count({ where }),
    ]);
    return { buyers, total };
  },

  findById: (id: string) =>
    prisma.buyer.findUnique({
      where: { id },
      include: {
        leads: { select: { id: true, status: true, leadScore: true, createdAt: true } },
        _count: { select: { outreaches: true } },
      },
    }),

  count: () => prisma.buyer.count(),
};
