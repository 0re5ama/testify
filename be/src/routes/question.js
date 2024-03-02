import { Router } from 'express';

import * as questionController from '@/controllers/question';

const router = Router();

router.get('/', questionController.get);

router.get('/:id', questionController.getById);
router.post('/', questionController.create);
router.put('/:id', questionController.update);

export default router;
