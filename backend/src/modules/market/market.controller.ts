import { Request, Response, NextFunction } from 'express';
import { marketService } from './market.service';
import { sendSuccess } from '../../utils/apiResponse';

/**
 * @swagger
 * tags:
 *   name: Market Intelligence
 *   description: AI-powered export opportunity analysis
 */
export const marketController = {
  /**
   * @swagger
   * /market/analyze:
   *   post:
   *     summary: Analyze export opportunities for a product
   *     tags: [Market Intelligence]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [product]
   *             properties:
   *               product: { type: string, example: "Organic Honey" }
   *               productId: { type: string, format: uuid }
   *               targetRegions: { type: array, items: { type: string } }
   *     responses:
   *       200:
   *         description: Market analysis result with recommended countries
   */
  analyze: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await marketService.analyze(req.user!.userId, req.body);
      sendSuccess(res, result, 'Market analysis complete');
    } catch (err) { next(err); }
  },

  getOpportunities: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const opportunities = await marketService.getOpportunities(req.user!.userId);
      sendSuccess(res, opportunities, 'Opportunities fetched');
    } catch (err) { next(err); }
  },
};
