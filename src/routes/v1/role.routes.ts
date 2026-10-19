import { Router } from 'express';
import {
  getRolesController,
  createRoleController,
  updateRoleController,
  updateRolePermissionsController,
  deleteRoleController,
  getPermissionsController,
} from '../../controllers/role.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/rbac.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createRoleSchema, updateRoleSchema, updateRolePermissionsSchema } from '../../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('roles:read'), getRolesController);
router.get('/permissions', requirePermission('roles:read'), getPermissionsController);

router.post(
  '/',
  requirePermission('roles:write'),
  validateRequest({ body: createRoleSchema }),
  createRoleController
);

router.put(
  '/:id',
  requirePermission('roles:write'),
  validateRequest({ body: updateRoleSchema }),
  updateRoleController
);

router.put(
  '/:id/permissions',
  requirePermission('roles:write'),
  validateRequest({ body: updateRolePermissionsSchema }),
  updateRolePermissionsController
);

router.delete(
  '/:id',
  requirePermission('roles:write'),
  deleteRoleController
);

export default router;
