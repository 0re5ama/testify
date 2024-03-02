import { Router } from 'express';

import * as wardController from '@/controllers/ward';

const router = Router();

router.get('/', wardController.getAll);

export default router;
