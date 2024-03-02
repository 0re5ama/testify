import { Router } from 'express';

import * as chapterController from '@/controllers/chapter';

const router = Router();

router.get('/', chapterController.get);

// router.get('/:id', chapterController.getById);
router.get('/:id/questions', chapterController.getQuestions);
router.post('/', chapterController.create);
router.put('/:id', chapterController.update);

export default router;
