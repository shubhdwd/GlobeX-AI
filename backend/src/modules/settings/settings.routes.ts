import { Router } from 'express';
import { settingsController } from './settings.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All settings routes require authentication
router.use(authenticate);

router.get('/profile', settingsController.getProfile);
router.put('/profile', settingsController.updateProfile);

router.get('/company', settingsController.getCompany);
router.put('/company', settingsController.updateCompany);

router.get('/notifications', settingsController.getNotifications);
router.put('/notifications', settingsController.updateNotifications);

router.put('/security/password', settingsController.updateSecurity);

router.get('/apikeys', settingsController.getApiKeys);
router.post('/apikeys', settingsController.createApiKey);
router.delete('/apikeys/:id', settingsController.deleteApiKey);

export { router as settingsRoutes };
