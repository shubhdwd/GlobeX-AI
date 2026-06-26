import { Router } from 'express';
import { tradeDataController } from './tradedata.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All trade data routes require authentication
router.use(authenticate);

router.get('/stats', tradeDataController.getStats);
router.get('/destinations', tradeDataController.getTopDestinations);
router.get('/partners', tradeDataController.getTradePartners);
router.get('/opportunities', tradeDataController.getMarketOpportunities);
router.get('/simulation-logs/:agentType', tradeDataController.getSimulationLogs);

export const tradeDataRoutes = router;
