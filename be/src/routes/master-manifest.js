import { Router } from 'express';

import * as masterManifestController from '@/controllers/master-manifest';

const router = Router();

router.get('/', masterManifestController.get);

router.get('/:id', masterManifestController.getById);
router.post('/', masterManifestController.create);
router.post('/:id/dispatch', masterManifestController.dispatch);
router.post('/:id/receive', masterManifestController.receive);
router.post('/', masterManifestController.create);
router.put('/:id', masterManifestController.update);

export default router;
