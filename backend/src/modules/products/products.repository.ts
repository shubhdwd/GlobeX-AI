import { prisma } from '../../config/database';

export const productsRepository = {
  create: (data: Parameters<typeof prisma.product.create>[0]['data']) =>
    prisma.product.create({ data }),

  findByUser: (userId: string) =>
    prisma.product.findMany({ where: { userId, isActive: true }, orderBy: { createdAt: 'desc' } }),

  findById: (id: string, userId?: string) =>
    prisma.product.findFirst({
      where: { id, ...(userId && { userId }), isActive: true },
      include: { leads: { select: { id: true, status: true, leadScore: true } } },
    }),

  softDelete: (id: string) =>
    prisma.product.update({ where: { id }, data: { isActive: false } }),

  count: (userId: string) => prisma.product.count({ where: { userId, isActive: true } }),
};
