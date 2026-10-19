import { Router } from 'express';
import { admissionsController } from '../controllers/admissions.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { tenantMiddleware, requireTenantContext } from '../../../middleware/tenant.middleware';
import { validateRequest } from '../../../middleware/validation.middleware';
import {
  createCampaignSchema,
  createPeriodSchema,
  createApplicantSchema,
  uploadDocumentSchema,
  verifyDocumentSchema,
  scheduleInterviewSchema,
  evaluateInterviewSchema,
  submitDecisionSchema,
  enrollApplicantSchema,
} from '../validators/admissions.validator';

const router = Router();

router.use(authenticate, tenantMiddleware, requireTenantContext);

// --- Admission Campaigns ---
router.get('/campaigns', admissionsController.getCampaigns);
router.get('/campaigns/:id', admissionsController.getCampaignById);
router.post('/campaigns', validateRequest({ body: createCampaignSchema }), admissionsController.createCampaign);
router.put('/campaigns/:id', admissionsController.updateCampaign);
router.post('/campaigns/:id/restore', admissionsController.restoreCampaign);
router.delete('/campaigns/:id', admissionsController.deleteCampaign);

// --- Registration Periods ---
router.get('/periods', admissionsController.getPeriods);
router.post('/periods', validateRequest({ body: createPeriodSchema }), admissionsController.createPeriod);

// --- Applicants ---
router.get('/applicants', admissionsController.getApplicants);
router.get('/applicants/waiting-list', admissionsController.getWaitingList);
router.get('/applicants/:id', admissionsController.getApplicantById);
router.post('/applicants', validateRequest({ body: createApplicantSchema }), admissionsController.createApplicant);
router.put('/applicants/:id', admissionsController.updateApplicant);
router.post('/applicants/:id/restore', admissionsController.restoreApplicant);
router.delete('/applicants/:id', admissionsController.deleteApplicant);
router.post('/applicants/bulk', admissionsController.bulkApplicantAction);

// --- Documents ---
router.get('/applicants/:id/documents', admissionsController.getApplicantDocuments);
router.post(
  '/applicants/:id/documents',
  validateRequest({ body: uploadDocumentSchema }),
  admissionsController.uploadDocument
);
router.patch(
  '/documents/:docId/verify',
  validateRequest({ body: verifyDocumentSchema }),
  admissionsController.verifyDocument
);

// --- Interviews & Exams ---
router.post(
  '/applicants/:id/interviews',
  validateRequest({ body: scheduleInterviewSchema }),
  admissionsController.scheduleInterview
);
router.patch(
  '/interviews/:interviewId/evaluate',
  validateRequest({ body: evaluateInterviewSchema }),
  admissionsController.evaluateInterview
);
router.post('/applicants/:id/exams', admissionsController.scheduleExam);

// --- Admission Decision & Waiting List ---
router.post(
  '/applicants/:id/decision',
  validateRequest({ body: submitDecisionSchema }),
  admissionsController.submitDecision
);
router.post('/applicants/:id/promote', admissionsController.promoteFromWaitingList);

// --- Enrollment Workflow ---
router.post(
  '/applicants/:id/enroll',
  validateRequest({ body: enrollApplicantSchema }),
  admissionsController.enrollApplicant
);
router.get('/students', admissionsController.getEnrolledStudents);

// --- Import / Export ---
router.post('/import/csv', admissionsController.importApplicantsCsv);
router.get('/export/csv', admissionsController.exportApplicantsCsv);

// --- Activity Timeline & Notifications ---
router.get('/activity', admissionsController.getActivityTimeline);
router.get('/notifications', admissionsController.getNotifications);

export default router;
