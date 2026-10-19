import { Router } from 'express';
import { curriculumController } from '../controllers/curriculum.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createCurriculumSchema, updateCurriculumSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', curriculumController.getCurriculums);
router.get('/:id', curriculumController.getCurriculumById);

router.post('/', validateRequest({ body: createCurriculumSchema }), curriculumController.createCurriculum);
router.put('/:id', validateRequest({ body: updateCurriculumSchema }), curriculumController.updateCurriculum);
router.patch('/:id/restore', curriculumController.restoreCurriculum);
router.patch('/:id/archive', curriculumController.archiveCurriculum);
router.delete('/:id', curriculumController.deleteCurriculum);

export default router;
