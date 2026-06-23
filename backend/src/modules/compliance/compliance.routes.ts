import { Router } from 'express';
import { complianceController } from './compliance.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/countries', complianceController.getAllCountries);
router.get('/:country', complianceController.getByCountry);

export { router as complianceRoutes };
