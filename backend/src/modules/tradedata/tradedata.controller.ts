import { Request, Response, NextFunction } from 'express';
import { tradeDataService } from '../../services/tradeDataService';
import { sendSuccess } from '../../utils/apiResponse';
import { prisma } from '../../config/database';

export const tradeDataController = {
  getStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = tradeDataService.getDatasetStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  },

  getTopDestinations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const destinations = tradeDataService.getTopExportDestinations(limit);
      sendSuccess(res, destinations);
    } catch (error) {
      next(error);
    }
  },

  getTradePartners: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const product = req.query.product as string;
      const country = req.query.country as string;
      
      if (product) {
        // Semantic/Fallback Product Search in Postgres
        const whereClause: any = {
          source: { startsWith: 'Dataset:' }
        };
        
        // Try strict match first, fallback to partial ILIKE match
        const buyers = await prisma.buyer.findMany({
          where: {
            tags: { has: product.split(' ')[0].toLowerCase() }
          },
          take: limit,
          orderBy: { leadScore: 'desc' }
        });
        
        if (buyers.length > 0) {
          return sendSuccess(res, buyers);
        }
        
        // Fallback: Just return any buyers that match the industry/product partially
        const fallbackBuyers = await prisma.buyer.findMany({
          where: {
            industry: { contains: product, mode: 'insensitive' }
          },
          take: limit,
          orderBy: { leadScore: 'desc' }
        });
        
        if (fallbackBuyers.length > 0) {
          return sendSuccess(res, fallbackBuyers);
        }
      }

      const partners = tradeDataService.getTradePartners(limit);
      sendSuccess(res, partners);
    } catch (error) {
      next(error);
    }
  },

  getMarketOpportunities: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const product = req.query.product as string;
      
      if (product) {
        const opps = await prisma.opportunity.findMany({
          where: {
            source: { startsWith: 'Dataset:' },
            insights: { contains: product, mode: 'insensitive' }
          },
          take: limit,
          orderBy: { demandScore: 'desc' }
        });
        
        if (opps.length > 0) {
          return sendSuccess(res, opps.map(o => ({
            country: o.country,
            countryCode: o.countryCode,
            demandScore: o.demandScore,
            growthRate: o.growthRate,
            competition: o.competition,
            totalTradeValue: parseInt(o.marketSize?.replace(/\D/g, '') || '0') * 1000000,
            tariffRate: 5.0
          })));
        }
      }
      
      const opportunities = tradeDataService.getMarketOpportunities(limit);
      sendSuccess(res, opportunities);
    } catch (error) {
      next(error);
    }
  },

  getSimulationLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentType } = req.params;
      const logs = tradeDataService.generateSimulationLogs(agentType);
      sendSuccess(res, { agentType, logs });
    } catch (error) {
      next(error);
    }
  },
};
