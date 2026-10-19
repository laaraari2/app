import { Router } from 'express';
import { peopleController } from '../controllers/people.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import {
  createStaffSchema,
  createTeacherProfileSchema,
  createStudentProfileSchema,
  createGuardianProfileSchema,
  createRelationshipSchema,
} from '../validators/people.validator';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

// --- STAFF ROUTES ---
router.get('/staff', peopleController.getStaff);
router.get('/staff/payroll/summary', peopleController.getPayrollSummary);
router.get('/staff/export/csv', peopleController.exportStaffCsv);
router.post('/staff/import/csv', peopleController.importStaffCsv);
router.post('/staff/bulk', peopleController.bulkStaffActions);
router.get('/staff/:id/certificate', peopleController.getWorkCertificate);
router.get('/staff/:id', peopleController.getStaffById);
router.post('/staff', validateRequest({ body: createStaffSchema }), peopleController.createStaff);
router.put('/staff/:id', peopleController.updateStaff);
router.post('/staff/:id/restore', peopleController.restoreStaff);
router.delete('/staff/:id', peopleController.deleteStaff);

// --- TEACHERS ROUTES ---
router.get('/teachers', peopleController.getTeachers);
router.get('/teachers/:id', peopleController.getTeacherById);
router.post('/teachers', validateRequest({ body: createTeacherProfileSchema }), peopleController.createTeacher);
router.put('/teachers/:id', peopleController.updateTeacher);
router.delete('/teachers/:id', peopleController.deleteTeacher);

// --- STUDENTS ROUTES ---
router.get('/students', peopleController.getStudents);
router.get('/students/export/csv', peopleController.exportStudentsCsv);
router.post('/students/import/csv', peopleController.importStudentsCsv);
router.post('/students/bulk', peopleController.bulkStudentActions);
router.get('/students/:id', peopleController.getStudentById);
router.post('/students', validateRequest({ body: createStudentProfileSchema }), peopleController.createStudent);
router.put('/students/:id', peopleController.updateStudent);
router.post('/students/:id/restore', peopleController.restoreStudent);
router.delete('/students/:id', peopleController.deleteStudent);
router.get('/students/:studentId/guardians', peopleController.getStudentGuardians);

// --- GUARDIANS ROUTES ---
router.get('/guardians', peopleController.getGuardians);
router.get('/guardians/:id', peopleController.getGuardianById);
router.post('/guardians', validateRequest({ body: createGuardianProfileSchema }), peopleController.createGuardian);
router.put('/guardians/:id', peopleController.updateGuardian);
router.get('/guardians/:guardianId/wards', peopleController.getGuardianWards);

// --- RELATIONSHIPS ROUTES ---
router.post('/relationships', validateRequest({ body: createRelationshipSchema }), peopleController.linkGuardianStudent);
router.delete('/relationships/:guardianId/:studentId', peopleController.unlinkGuardianStudent);

// --- ACTIVITY TIMELINE ---
router.get('/timeline', peopleController.getTimeline);

export default router;
