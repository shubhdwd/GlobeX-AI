import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/apiResponse';

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregated metrics for the frontend dashboard
 */
export const dashboardController = {
  /**
   * @swagger
   * /dashboard:
   *   get:
   *     summary: Get dashboard summary
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard data
   *         content:
   *           application/json:
   *             example:
   *               overview:
   *                 buyersFound: 125
   *                 countriesAnalyzed: 18
   *                 activeLeads: 35
   *                 avgLeadScore: 84
   *               pipeline:
   *                 - status: NEW
   *                   count: 12
   *               topCountries: []
   *               recentLeads: []
   */
  getSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.getSummary(req.user!.userId);
      sendSuccess(res, data, 'Dashboard data fetched');
    } catch (err) { next(err); }
  },
};
