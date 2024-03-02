import { Router } from 'express';

import * as monthController from '@/controllers/month';

const router = Router();

router.get('/', monthController.getAll);

export default router;
