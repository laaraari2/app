import { Router } from 'express';
import { educationalStageController } from '../controllers/educational-stage.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createEducationalStageSchema, updateEducationalStageSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', educationalStageController.getStages);
router.get('/:id', educationalStageController.getStageById);

router.post('/', validateRequest({ body: createEducationalStageSchema }), educationalStageController.createStage);
router.put('/:id', validateRequest({ body: updateEducationalStageSchema }), educationalStageController.updateStage);
router.patch('/:id/restore', educationalStageController.restoreStage);
router.patch('/:id/archive', educationalStageController.archiveStage);
router.delete('/:id', educationalStageController.deleteStage);

export default router;
