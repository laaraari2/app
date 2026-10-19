import { Router } from 'express';
import { academicTermController } from '../controllers/academic-term.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createAcademicTermSchema, updateAcademicTermSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', academicTermController.getTerms);
router.get('/:id', academicTermController.getTermById);

router.post('/', validateRequest({ body: createAcademicTermSchema }), academicTermController.createTerm);
router.put('/:id', validateRequest({ body: updateAcademicTermSchema }), academicTermController.updateTerm);
router.patch('/:id/restore', academicTermController.restoreTerm);
router.patch('/:id/archive', academicTermController.archiveTerm);
router.delete('/:id', academicTermController.deleteTerm);

export default router;
