import { Router } from 'express';
import { academicYearController } from '../controllers/academic-year.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createAcademicYearSchema, updateAcademicYearSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', academicYearController.getAcademicYears);
router.get('/current', academicYearController.getCurrentAcademicYear);
router.get('/:id', academicYearController.getAcademicYearById);

router.post('/', validateRequest({ body: createAcademicYearSchema }), academicYearController.createAcademicYear);
router.put('/:id', validateRequest({ body: updateAcademicYearSchema }), academicYearController.updateAcademicYear);
router.patch('/:id/activate', academicYearController.setCurrentAcademicYear);
router.patch('/:id/restore', academicYearController.restoreAcademicYear);
router.patch('/:id/archive', academicYearController.archiveAcademicYear);
router.delete('/:id', academicYearController.deleteAcademicYear);

export default router;
