import type { Request, Response, NextFunction } from 'express';
import { settingsService } from './settings.service';
import { 
  ProfileUpdateSchema, 
  CompanyUpdateSchema, 
  NotificationsUpdateSchema, 
  SecurityUpdateSchema, 
  ApiKeyCreateSchema 
} from './settings.schema';

export const settingsController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.getProfile(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = ProfileUpdateSchema.parse(req.body);
      const data = await settingsService.updateProfile(req.user!.userId, dto);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.getCompany(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async updateCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CompanyUpdateSchema.parse(req.body);
      const data = await settingsService.updateCompany(req.user!.userId, dto);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.getNotifications(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async updateNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = NotificationsUpdateSchema.parse(req.body);
      const data = await settingsService.updateNotifications(req.user!.userId, dto);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async updateSecurity(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = SecurityUpdateSchema.parse(req.body);
      const data = await settingsService.changePassword(req.user!.userId, dto);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getApiKeys(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.getApiKeys(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async createApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = ApiKeyCreateSchema.parse(req.body);
      const data = await settingsService.createApiKey(req.user!.userId, dto.name);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async deleteApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await settingsService.deleteApiKey(req.user!.userId, id);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }
};
