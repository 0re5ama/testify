import { Router } from 'express';

import * as unitController from '@/controllers/unit';

const router = Router();

router.get('/', unitController.get);

// router.get('/:id', unitController.getById);
router.get('/:id/chapters', unitController.getChapters);
router.post('/', unitController.create);
router.put('/:id', unitController.update);

export default router;
