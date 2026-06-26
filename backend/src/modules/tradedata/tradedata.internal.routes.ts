import { Router } from 'express';
import { tradeDataController } from './tradedata.controller';

// Internal router — no authentication required.
// Called by the Python AI microservice (which has no user JWT).
// These are READ-ONLY dataset analytics endpoints.
const internalRouter = Router();

internalRouter.get('/stats', tradeDataController.getStats);
internalRouter.get('/destinations', tradeDataController.getTopDestinations);
internalRouter.get('/partners', tradeDataController.getTradePartners);
internalRouter.get('/opportunities', tradeDataController.getMarketOpportunities);
internalRouter.get('/simulation-logs/:agentType', tradeDataController.getSimulationLogs);

export const tradeDataInternalRoutes = internalRouter;
