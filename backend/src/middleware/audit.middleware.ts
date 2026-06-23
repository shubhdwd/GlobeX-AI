import { Request, Response, NextFunction } from 'express';
import { AuditAction } from '../types/prisma';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export const auditLog =
  (action: AuditAction, entity: string) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user) {
        await prisma.auditLog.create({
          data: {
            userId: req.user.userId,
            action,
            entity,
            entityId: req.params.id,
            newValues: req.body,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          },
        });
      }
    } catch (err) {
      logger.warn('Audit log failed:', err);
    }
    next();
  };
