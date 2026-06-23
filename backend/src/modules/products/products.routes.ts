import { Router } from 'express';
import { productsController } from './products.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createProductSchema } from './products.schema';

const router = Router();
router.use(authenticate);

router.post('/', validate(createProductSchema), productsController.create);
router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.delete('/:id', productsController.delete);

export { router as productsRoutes };
