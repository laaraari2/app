import { Router } from 'express';
import { timetableController } from '../controllers/timetable.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import { createTimetableSlotSchema, updateTimetableSlotSchema } from '../validators/academic.validators';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

router.get('/slots', timetableController.getSlots);
router.get('/slots/:id', timetableController.getSlotById);
router.get('/conflicts', timetableController.detectConflicts);

router.post('/slots', validateRequest({ body: createTimetableSlotSchema }), timetableController.createSlot);
router.put('/slots/:id', validateRequest({ body: updateTimetableSlotSchema }), timetableController.updateSlot);
router.patch('/slots/:id/restore', timetableController.restoreSlot);
router.patch('/slots/:id/archive', timetableController.archiveSlot);
router.delete('/slots/:id', timetableController.deleteSlot);

export default router;
