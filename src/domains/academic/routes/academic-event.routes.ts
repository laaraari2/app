import { Router } from 'express';
import { academicEventController } from '../controllers/academic-event.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createAcademicEventSchema, updateAcademicEventSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', academicEventController.getEvents);
router.get('/:id', academicEventController.getEventById);

router.post('/', validateRequest({ body: createAcademicEventSchema }), academicEventController.createEvent);
router.put('/:id', validateRequest({ body: updateAcademicEventSchema }), academicEventController.updateEvent);
router.patch('/:id/restore', academicEventController.restoreEvent);
router.patch('/:id/archive', academicEventController.archiveEvent);
router.delete('/:id', academicEventController.deleteEvent);

export default router;
