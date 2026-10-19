import { Router } from 'express';
import { classGroupController } from '../controllers/class-group.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createClassGroupSchema, updateClassGroupSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', classGroupController.getClassGroups);
router.get('/:id', classGroupController.getClassGroupById);

router.post('/', validateRequest({ body: createClassGroupSchema }), classGroupController.createClassGroup);
router.put('/:id', validateRequest({ body: updateClassGroupSchema }), classGroupController.updateClassGroup);
router.patch('/:id/restore', classGroupController.restoreClassGroup);
router.patch('/:id/archive', classGroupController.archiveClassGroup);
router.delete('/:id', classGroupController.deleteClassGroup);

export default router;
