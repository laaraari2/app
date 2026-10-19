import { Router } from 'express';
import { academicActivityController } from '../controllers/academic-activity.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/activity', academicActivityController.getActivityTimeline);

export default router;
