import { Router } from 'express';

import * as questionSetController from '@/controllers/question-set';

const router = Router();

router.get('/', questionSetController.get);

// router.get('/:id', questionSetController.getById);
router.get('/:id/print', questionSetController.print);
router.post('/', questionSetController.create);
router.post('/print', questionSetController.printQuestions);
router.get('/print', questionSetController.testprint);
router.put('/:id', questionSetController.update);

export default router;
