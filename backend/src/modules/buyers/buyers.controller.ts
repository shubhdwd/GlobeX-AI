import { Request, Response, NextFunction } from 'express';
import { buyersService } from './buyers.service';
import { sendSuccess } from '../../utils/apiResponse';

export const buyersController = {
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await buyersService.search(req.query as any);
      sendSuccess(res, result.buyers, 'Buyers fetched', 200, { pagination: result.pagination });
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buyer = await buyersService.getById(req.params.id);
      sendSuccess(res, buyer);
    } catch (err) { next(err); }
  },
};
