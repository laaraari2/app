import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import {
  recordAttendanceSchema,
  correctAttendanceSchema,
  approveAttendanceSchema,
} from '../validators/attendance.validator';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

// Get stats
router.get('/stats', attendanceController.getStats);

// Registers
router.get('/registers', attendanceController.getRegisters);
router.get('/registers/:id', attendanceController.getRegisterById);
router.post(
  '/registers',
  validateRequest({ body: recordAttendanceSchema }),
  attendanceController.recordAttendance
);
router.post(
  '/registers/:registerId/approve',
  attendanceController.approveRegister
);

// Records & Corrections
router.post(
  '/records/correct',
  validateRequest({ body: correctAttendanceSchema }),
  attendanceController.correctAttendance
);
router.get('/records/:recordId/history', attendanceController.getRecordHistory);

// Student Attendance Lookup
router.get('/students/:studentId', attendanceController.getStudentAttendance);

export default router;
