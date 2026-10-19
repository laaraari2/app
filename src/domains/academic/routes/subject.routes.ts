import { Router } from 'express';
import { subjectController } from '../controllers/subject.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createSubjectSchema, updateSubjectSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', subjectController.getSubjects);
router.get('/:id', subjectController.getSubjectById);

router.post('/', validateRequest({ body: createSubjectSchema }), subjectController.createSubject);
router.put('/:id', validateRequest({ body: updateSubjectSchema }), subjectController.updateSubject);
router.patch('/:id/restore', subjectController.restoreSubject);
router.patch('/:id/archive', subjectController.archiveSubject);
router.delete('/:id', subjectController.deleteSubject);

export default router;
