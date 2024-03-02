import { Router } from 'express';

import * as rateController from '@/controllers/rate';

const router = Router();

router.get('/', rateController.get);

router.post('/', rateController.create);
router.put('/:id', rateController.update);

export default router;
