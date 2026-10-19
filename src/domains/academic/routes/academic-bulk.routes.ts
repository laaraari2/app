import { Router } from 'express';
import { academicBulkController } from '../controllers/academic-bulk.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.post('/:entityType/bulk', academicBulkController.executeBulkOperation);

export default router;
