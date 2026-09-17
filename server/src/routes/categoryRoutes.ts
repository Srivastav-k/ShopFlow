import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.patch('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
