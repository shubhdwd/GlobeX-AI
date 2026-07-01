import { Router } from 'express';
import { startPipeline } from '../controllers/pipelineController';

const router = Router();

// Pipeline Routes
router.post('/start', startPipeline);

export default router;
