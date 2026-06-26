import { prisma } from '../../config/database';
import { LeadStatus } from '@prisma/client';
import { tradeDataService } from '../../services/tradeDataService';

export const dashboardService = {
  async getSummary(userId: string) {
    const [
      buyersFound,
      activeLeads,
      leadScoreAgg,
      topOpportunities,
      recentLeads,
      leadsByStatus,
      productsCount,
      outreachCount,
    ] = await Promise.all([
      // Total unique buyers the user has leads for
      prisma.lead.groupBy({ by: ['buyerId'], where: { userId } }).then((r) => r.length),

      // Active leads (not LOST or CONVERTED)
      prisma.lead.count({
        where: { userId, status: { notIn: [LeadStatus.LOST, LeadStatus.CONVERTED] } },
      }),

      // Avg lead score
      prisma.lead.aggregate({ where: { userId }, _avg: { leadScore: true }, _count: true }),

      // Top opportunities by demand score
      prisma.opportunity.findMany({
        where: { userId },
        orderBy: { demandScore: 'desc' },
        take: 5,
        include: { product: { select: { productName: true } } },
      }),

      // Recent leads with buyer info
      prisma.lead.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { buyer: { select: { companyName: true, country: true } } },
      }),

      // Lead pipeline breakdown
      prisma.lead.groupBy({
        by: ['status'],
        where: { userId },
        _count: { _all: true },
      }),

      // Number of registered products
      prisma.product.count({ where: { userId, isActive: true } }),

      // Total outreach messages sent
      prisma.outreach.count({ where: { userId } }),
    ]);

    const countriesAnalyzed = await prisma.opportunity.groupBy({
      by: ['countryCode'],
      where: { userId },
    }).then((r) => r.length);

    const datasetStats = tradeDataService.getDatasetStats();

    return {
      overview: {
        buyersFound,
        countriesAnalyzed,
        activeLeads,
        avgLeadScore: Math.round(leadScoreAgg._avg.leadScore ?? 0),
        totalLeads: leadScoreAgg._count,
        productsRegistered: productsCount,
        outreachSent: outreachCount,
      },
      datasetStats,
      pipeline: leadsByStatus.map((s) => ({ status: s.status, count: s._count._all })),
      topCountries: topOpportunities.map((o) => ({
        country: o.country,
        countryCode: o.countryCode,
        demandScore: o.demandScore,
        growthRate: o.growthRate,
        product: o.product?.productName,
      })),
      recentOpportunities: topOpportunities.slice(0, 3),
      recentLeads: recentLeads.map((l) => ({
        id: l.id,
        buyer: l.buyer.companyName,
        country: l.buyer.country,
        status: l.status,
        leadScore: l.leadScore,
        createdAt: l.createdAt,
      })),
    };
  },
};
