import { Router } from 'express';

import * as manifestController from '@/controllers/manifest';
import { isAuthenticated } from '@/middleware';

const router = Router();

router.get('/', isAuthenticated, manifestController.get);
router.get(
    '/by-manifest-no/:manifestNo',
    isAuthenticated,
    manifestController.getByManifestNo,
);
router.get(
    '/for-master-manifest',
    isAuthenticated,
    manifestController.forMasterManifest,
);
router.get('/:id', isAuthenticated, manifestController.getById);
router.post('/', isAuthenticated, manifestController.create);
router.post('/:id/dispatch', isAuthenticated, manifestController.dispatch);
router.post('/:id/receive', isAuthenticated, manifestController.receive);
router.post('/', isAuthenticated, manifestController.create);
router.put('/:id', isAuthenticated, manifestController.update);

export default router;
