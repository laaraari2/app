import { Router } from 'express';
import { gradeLevelController } from '../controllers/grade-level.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createGradeLevelSchema, updateGradeLevelSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', gradeLevelController.getGrades);
router.get('/:id', gradeLevelController.getGradeById);

router.post('/', validateRequest({ body: createGradeLevelSchema }), gradeLevelController.createGrade);
router.put('/:id', validateRequest({ body: updateGradeLevelSchema }), gradeLevelController.updateGrade);
router.patch('/:id/restore', gradeLevelController.restoreGrade);
router.patch('/:id/archive', gradeLevelController.archiveGrade);
router.delete('/:id', gradeLevelController.deleteGrade);

export default router;
