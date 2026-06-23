import { Request, Response, NextFunction } from 'express';
import { productsService } from './products.service';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Export product registration and management
 */

export const productsController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productsService.create(req.user!.userId, req.body);
      sendCreated(res, product, 'Product registered for export');
    } catch (err) { next(err); }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productsService.getAll(req.user!.userId);
      sendSuccess(res, products, 'Products fetched');
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productsService.getById(req.params.id, req.user!.userId);
      sendSuccess(res, product);
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productsService.delete(req.params.id, req.user!.userId);
      sendSuccess(res, null, 'Product removed');
    } catch (err) { next(err); }
  },
};
