import { prisma } from '../../config/database';
import { marketResearchAgent } from '../agents/MarketResearchAgent';
import type { AnalyzeMarketDto } from './market.schema';

export interface CountryOpportunity {
  country: string;
  countryCode: string;
  demandScore: number;
  growthRate: string;
  competition: 'Low' | 'Medium' | 'High';
  marketSize?: string;
  trend?: string;
  insights?: string;
}

export interface MarketAnalysisResult {
  product: string;
  analyzedAt: string;
  recommendedCountries: CountryOpportunity[];
  summary: string;
}

export const marketService = {
  async analyze(userId: string, dto: AnalyzeMarketDto): Promise<MarketAnalysisResult> {
    // ── AI Agent Hook ────────────────────────────────────────────
    // This delegates to the MarketResearchAgent.
    // The agent currently returns mock data — plug in real AI here.
    const agentResult = await marketResearchAgent.analyze({
      product: dto.product,
      targetRegions: dto.targetRegions,
    });

    // ── Persist opportunities for the user ───────────────────────
    if (dto.productId && agentResult.recommendedCountries.length > 0) {
      await prisma.opportunity.createMany({
        data: agentResult.recommendedCountries.map((c) => ({
          userId,
          productId: dto.productId,
          country: c.country,
          countryCode: c.countryCode,
          demandScore: c.demandScore,
          growthRate: c.growthRate,
          competition: c.competition,
          marketSize: c.marketSize,
          trend: c.trend,
          insights: c.insights,
          source: 'ai_analysis',
        })),
        skipDuplicates: true,
      });
    }

    return agentResult;
  },

  async getOpportunities(userId: string) {
    return prisma.opportunity.findMany({
      where: { userId },
      orderBy: { demandScore: 'desc' },
      include: { product: { select: { productName: true } } },
    });
  },
};
