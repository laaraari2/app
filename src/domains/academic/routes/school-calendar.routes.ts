import { Router } from 'express';
import { schoolCalendarController } from '../controllers/school-calendar.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createSchoolCalendarSchema, updateSchoolCalendarSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/', schoolCalendarController.getCalendars);
router.get('/:id', schoolCalendarController.getCalendarById);

router.post('/', validateRequest({ body: createSchoolCalendarSchema }), schoolCalendarController.createCalendar);
router.put('/:id', validateRequest({ body: updateSchoolCalendarSchema }), schoolCalendarController.updateCalendar);
router.patch('/:id/restore', schoolCalendarController.restoreCalendar);
router.patch('/:id/archive', schoolCalendarController.archiveCalendar);
router.delete('/:id', schoolCalendarController.deleteCalendar);

export default router;
