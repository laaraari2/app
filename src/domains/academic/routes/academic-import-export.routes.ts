import { Router } from 'express';
import { academicImportExportController } from '../controllers/academic-import-export.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.post('/import/subjects', academicImportExportController.importSubjectsCsv);
router.get('/export/subjects', academicImportExportController.exportSubjectsCsv);
router.get('/export/class-groups', academicImportExportController.exportClassGroupsCsv);
router.get('/export/grade-levels', academicImportExportController.exportGradeLevelsCsv);

export default router;
