import { Router } from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '../controllers/user.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/rbac.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../../../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('users:read'), getUsersController);
router.get('/:id', requirePermission('users:read'), getUserByIdController);

router.post(
  '/',
  requirePermission('users:write'),
  validateRequest({ body: createUserSchema }),
  createUserController
);

router.patch(
  '/:id',
  requirePermission('users:write'),
  validateRequest({ body: updateUserSchema }),
  updateUserController
);

router.delete('/:id', requirePermission('users:delete'), deleteUserController);

export default router;
