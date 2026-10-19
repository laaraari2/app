import { Router } from 'express';
import { settingsController } from '../../controllers/settings.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../middleware/tenant.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import {
  updatePlatformSettingsSchema,
  updateTenantSettingsSchema,
  updateCampusSettingsSchema,
  updateAcademicYearSettingsSchema,
} from '../../validators/schemas';

const router = Router();

router.use(authenticate, tenantMiddleware);

// 1. Platform Settings (SuperAdmin)
router.get('/platform', settingsController.getPlatformSettings);
router.put('/platform', validateRequest({ body: updatePlatformSettingsSchema }), settingsController.updatePlatformSettings);

// 2. Tenant Settings
router.get('/tenant', requireTenantContext, settingsController.getTenantSettings);
router.put('/tenant', requireTenantContext, validateRequest({ body: updateTenantSettingsSchema }), settingsController.updateTenantSettings);

// 3. Campus Settings
router.get('/campus/:campusId', requireTenantContext, settingsController.getCampusSettings);
router.put('/campus/:campusId', requireTenantContext, validateRequest({ body: updateCampusSettingsSchema }), settingsController.updateCampusSettings);

// 4. Academic Year Settings
router.get('/academic-year/:academicYearId', requireTenantContext, settingsController.getAcademicYearSettings);
router.put('/academic-year/:academicYearId', requireTenantContext, validateRequest({ body: updateAcademicYearSettingsSchema }), settingsController.updateAcademicYearSettings);

export default router;
