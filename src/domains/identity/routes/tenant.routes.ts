import { Router } from 'express';
import {
  createTenantController,
  getTenantsController,
  getTenantByIdController,
  updateTenantController,
  deleteTenantController,
} from '../controllers/tenant.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { requireRole, requirePermission } from '../../../middleware/rbac.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createTenantSchema, updateTenantSchema } from '../../../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('tenants:read'), getTenantsController);
router.get('/:id', requirePermission('tenants:read'), getTenantByIdController);

router.post(
  '/',
  requireRole('SUPER_ADMIN'),
  validateRequest({ body: createTenantSchema }),
  createTenantController
);

router.patch(
  '/:id',
  requirePermission('tenants:write'),
  validateRequest({ body: updateTenantSchema }),
  updateTenantController
);

router.delete('/:id', requireRole('SUPER_ADMIN'), deleteTenantController);

export default router;
