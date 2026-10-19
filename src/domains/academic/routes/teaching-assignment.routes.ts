import { Router } from 'express';
import { teachingAssignmentController } from '../controllers/teaching-assignment.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createTeachingAssignmentSchema, updateTeachingAssignmentSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', teachingAssignmentController.getAssignments);
router.get('/:id', teachingAssignmentController.getAssignmentById);

router.post('/', validateRequest({ body: createTeachingAssignmentSchema }), teachingAssignmentController.createAssignment);
router.put('/:id', validateRequest({ body: updateTeachingAssignmentSchema }), teachingAssignmentController.updateAssignment);
router.patch('/:id/restore', teachingAssignmentController.restoreAssignment);
router.patch('/:id/archive', teachingAssignmentController.archiveAssignment);
router.delete('/:id', teachingAssignmentController.deleteAssignment);

export default router;
