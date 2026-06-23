import { Request, Response, NextFunction } from 'express';
import { complianceService } from './compliance.service';
import { sendSuccess } from '../../utils/apiResponse';

export const complianceController = {
  getByCountry: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await complianceService.getByCountry(req.params.country);
      sendSuccess(res, data, `Compliance requirements for ${req.params.country}`);
    } catch (err) { next(err); }
  },

  getAllCountries: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await complianceService.getAllCountries();
      sendSuccess(res, countries, 'Available countries');
    } catch (err) { next(err); }
  },
};
