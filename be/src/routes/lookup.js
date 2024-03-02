import { Router } from 'express';

import * as lookupController from '@/controllers/lookup';

const router = Router();

router.get('/classes', lookupController.getClasses);
router.get('/question-types', lookupController.getQuestionTypes);

export default router;
