import { Router } from 'express';

import * as reportController from '@/controllers/report';

const router = Router();

router.post('/sales', reportController.sales);

export default router;
