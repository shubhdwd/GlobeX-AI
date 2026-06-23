import { Router } from 'express';
import { leadsController } from './leads.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createLeadSchema, updateLeadSchema } from './leads.schema';

const router = Router();
router.use(authenticate);

router.post('/', validate(createLeadSchema), leadsController.create);
router.get('/', leadsController.getAll);
router.get('/stats', leadsController.getStats);
router.patch('/:id', validate(updateLeadSchema), leadsController.update);
router.delete('/:id', leadsController.delete);

export { router as leadsRoutes };
