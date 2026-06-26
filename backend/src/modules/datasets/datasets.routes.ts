import { Router } from 'express';
import { listDatasets } from './datasets.controller';

const router = Router();

// /api/v1/datasets
router.get('/', listDatasets);

export { router as datasetsRoutes };
