import { Router } from 'express';

import * as userController from '@/controllers/user';

const router = Router();

router.get('/', userController.getAll);

export default router;
