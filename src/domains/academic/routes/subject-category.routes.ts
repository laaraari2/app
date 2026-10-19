import { Router } from 'express';
import { subjectCategoryController } from '../controllers/subject-category.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createSubjectCategorySchema, updateSubjectCategorySchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', subjectCategoryController.getCategories);
router.get('/:id', subjectCategoryController.getCategoryById);

router.post('/', validateRequest({ body: createSubjectCategorySchema }), subjectCategoryController.createCategory);
router.put('/:id', validateRequest({ body: updateSubjectCategorySchema }), subjectCategoryController.updateCategory);
router.patch('/:id/restore', subjectCategoryController.restoreCategory);
router.patch('/:id/archive', subjectCategoryController.archiveCategory);
router.delete('/:id', subjectCategoryController.deleteCategory);

export default router;
