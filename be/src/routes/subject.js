import { Router } from 'express';

import * as subjectController from '@/controllers/subject';

const router = Router();

router.get('/', subjectController.get);

router.get('/:id/units', subjectController.getUnits);
router.post('/', subjectController.create);
router.put('/:id', subjectController.update);

export default router;
