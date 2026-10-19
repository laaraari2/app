import { db } from '../src/db/store';
import { admissionCampaignService } from '../src/domains/admissions/application/services/admission-campaign.service';
import { registrationPeriodService } from '../src/domains/admissions/application/services/registration-period.service';
import { applicantService } from '../src/domains/admissions/application/services/applicant.service';
import { applicantDocumentService } from '../src/domains/admissions/application/services/applicant-document.service';
import { applicantInterviewService } from '../src/domains/admissions/application/services/applicant-interview.service';
import { applicantExamService } from '../src/domains/admissions/application/services/applicant-exam.service';
import { admissionDecisionService } from '../src/domains/admissions/application/services/admission-decision.service';
import { waitingListService } from '../src/domains/admissions/application/services/waiting-list.service';
import { enrollmentService } from '../src/domains/admissions/application/services/enrollment.service';
import { admissionsImportExportService } from '../src/domains/admissions/application/services/admissions-import-export.service';
import { admissionsActivityService } from '../src/domains/admissions/application/services/admissions-activity.service';
import { admissionsNotificationService } from '../src/domains/admissions/application/services/admissions-notification.service';
import {
  ApplicantNotApprovedError,
  InvalidStatusTransitionError,
} from '../src/domains/admissions/domain/errors/admissions-domain.error';

export async function runAdmissionsDomainTests() {
  console.log('🧪 Starting Admissions Domain Verification Tests...\n');

  db.reset();

  const tenantId = 'tenant_admissions_test';
  const academicYearId = 'ay_2025_2026';
  const userId = 'user_admin_1';
  const userEmail = 'admin@eduvora.com';

  // 1. Admission Campaign
  console.log('1. Testing Admission Campaign CRUD...');
  const campaign = await admissionCampaignService.createCampaign(
    tenantId,
    {
      academicYearId,
      code: 'CAMP-2025',
      name: 'Campagne d\'Admission 2025-2026',
      description: 'Campagne principale d\'admissions',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      status: 'ACTIVE',
      maxCapacity: 500,
    },
    userId,
    userEmail
  );

  if (campaign.code !== 'CAMP-2025' || campaign.status !== 'ACTIVE') {
    throw new Error('Campaign creation failed');
  }

  const campaignList = await admissionCampaignService.getPaginatedCampaigns(tenantId, {});
  if (campaignList.total !== 1) {
    throw new Error('Campaign pagination failed');
  }
  console.log('  ✓ Admission Campaign created and listed successfully.');

  // 2. Registration Period
  console.log('2. Testing Registration Period CRUD...');
  const period = await registrationPeriodService.createPeriod(
    tenantId,
    {
      campaignId: campaign.id,
      code: 'PER-SPRING',
      name: 'Période de Printemps',
      startDate: '2025-02-01',
      endDate: '2025-04-30',
      targetGradeIds: ['grade_6th', 'grade_7th'],
      maxApplicants: 200,
      status: 'OPEN',
    },
    userId,
    userEmail
  );

  if (period.targetGradeIds.length !== 2) {
    throw new Error('Registration period creation failed');
  }
  console.log('  ✓ Registration Period created and linked to campaign.');

  // 3. Applicant & Parent/Guardian Information
  console.log('3. Testing Applicant creation, validation & number generation...');
  const applicant = await applicantService.createApplicant(
    tenantId,
    {
      campaignId: campaign.id,
      periodId: period.id,
      academicYearId,
      targetGradeId: 'grade_6th',
      firstName: 'Adam',
      lastName: 'Bennani',
      dateOfBirth: '2014-05-12',
      gender: 'MALE',
      nationality: 'Marocaine',
      nationalId: 'AB123456',
      email: 'adam.bennani@example.com',
      phone: '0661000000',
      currentSchool: 'École Primaire Al Amal',
      guardians: [
        {
          relation: 'FATHER',
          fullName: 'Karim Bennani',
          phone: '0661112233',
          email: 'karim.bennani@example.com',
          profession: 'Ingénieur',
          isPrimary: true,
        },
      ],
      notes: 'Excellents résultats scolaires',
    },
    userId,
    userEmail
  );

  if (!applicant.applicationNumber.startsWith('APP-') || applicant.status !== 'SUBMITTED') {
    throw new Error('Applicant creation failed');
  }
  if (!applicant.guardians || applicant.guardians.length === 0 || !applicant.guardians[0].isPrimary) {
    throw new Error('Guardian validation failed');
  }
  console.log(`  ✓ Applicant created: ${applicant.firstName} ${applicant.lastName} (${applicant.applicationNumber})`);

  // 4. Status Workflow & State Machine
  console.log('4. Testing Applicant status state machine transitions...');
  // SUBMITTED -> UNDER_REVIEW
  await applicantService.changeApplicantStatus(applicant.id, tenantId, 'UNDER_REVIEW', userId, userEmail);
  let updatedApplicant = await applicantService.getApplicantById(applicant.id, tenantId);
  if (updatedApplicant.status !== 'UNDER_REVIEW') {
    throw new Error('Status transition to UNDER_REVIEW failed');
  }

  // Invalid transition attempt: UNDER_REVIEW -> ENROLLED (Must be ACCEPTED first)
  try {
    await applicantService.changeApplicantStatus(applicant.id, tenantId, 'ENROLLED', userId, userEmail);
    throw new Error('Should have thrown InvalidStatusTransitionError');
  } catch (err: any) {
    if (!(err instanceof InvalidStatusTransitionError)) {
      throw err;
    }
    console.log('  ✓ Invalid status transition prevented correctly.');
  }

  // 5. Document Verification Workflow
  console.log('5. Testing Required Documents upload and verification...');
  const doc = await applicantDocumentService.uploadDocument(
    tenantId,
    applicant.id,
    {
      documentType: 'BIRTH_CERTIFICATE',
      fileName: 'acte_de_naissance.pdf',
      fileUrl: 'https://storage.eduvora.com/docs/acte_de_naissance.pdf',
      fileSize: 1024500,
    },
    userId,
    userEmail
  );

  if (doc.status !== 'PENDING') {
    throw new Error('Document status should default to PENDING');
  }

  // Reject document -> applicant status changes to WAITING_DOCUMENTS
  await applicantDocumentService.verifyDocument(
    tenantId,
    doc.id,
    {
      status: 'REJECTED',
      rejectionReason: 'Document illisible',
    },
    userId,
    userEmail
  );

  updatedApplicant = await applicantService.getApplicantById(applicant.id, tenantId);
  if (updatedApplicant.status !== 'WAITING_DOCUMENTS') {
    throw new Error('Rejection of document should put applicant in WAITING_DOCUMENTS');
  }
  console.log('  ✓ Document rejection triggered WAITING_DOCUMENTS status correctly.');

  // Re-verify document -> move back to UNDER_REVIEW
  await applicantDocumentService.verifyDocument(
    tenantId,
    doc.id,
    { status: 'VERIFIED' },
    userId,
    userEmail
  );
  await applicantService.changeApplicantStatus(applicant.id, tenantId, 'UNDER_REVIEW', userId, userEmail);
  console.log('  ✓ Document verified and applicant returned to UNDER_REVIEW.');

  // 6. Optional Interview & Entrance Exam
  console.log('6. Testing Interview and Exam scheduling...');
  const interview = await applicantInterviewService.scheduleInterview(
    tenantId,
    applicant.id,
    {
      scheduledAt: '2025-03-10T10:00:00Z',
      location: 'Salle d\'Entretien 102',
      interviewerName: 'M. Alami',
    },
    userId,
    userEmail
  );

  await applicantInterviewService.evaluateInterview(
    tenantId,
    interview.id,
    {
      score: 85,
      recommendation: 'RECOMMENDED',
      interviewerNotes: 'Candidat très motivé et très bon niveau de langue.',
    },
    userId,
    userEmail
  );

  const exams = await applicantExamService.createExam(
    tenantId,
    applicant.id,
    {
      examName: 'Test de Mathématiques et Français',
      examDate: '2025-03-15T09:00:00Z',
      maxScore: 100,
    },
    userId,
    userEmail
  );

  await applicantExamService.evaluateExam(
    tenantId,
    exams.id,
    {
      scoreObtained: 92,
      passed: true,
      comments: 'Excellente maîtrise du programme.',
    },
    userId,
    userEmail
  );
  console.log('  ✓ Interview and Entrance Exam completed and evaluated.');

  // 7. Business Rule Check: Applicant is NOT a Student yet
  console.log('7. Testing strict Business Rule: Applicant is NOT a Student before enrollment approval...');
  try {
    await enrollmentService.enrollApplicant(tenantId, applicant.id, {}, userId, userEmail);
    throw new Error('Should have thrown ApplicantNotApprovedError');
  } catch (err: any) {
    if (!(err instanceof ApplicantNotApprovedError)) {
      throw err;
    }
    console.log('  ✓ Enrollment of non-accepted applicant blocked as mandated.');
  }

  // 8. Admission Decision & Waiting List
  console.log('8. Testing Admission Decision (Accepted / Waiting List)...');
  // Create second applicant for waiting list
  const applicant2 = await applicantService.createApplicant(
    tenantId,
    {
      campaignId: campaign.id,
      periodId: period.id,
      academicYearId,
      targetGradeId: 'grade_6th',
      firstName: 'Sami',
      lastName: 'El Fassi',
      dateOfBirth: '2014-08-20',
      gender: 'MALE',
      nationality: 'Marocaine',
      guardians: [
        {
          relation: 'MOTHER',
          fullName: 'Laila El Fassi',
          phone: '0662223344',
          isPrimary: true,
        },
      ],
    },
    userId,
    userEmail
  );
  await applicantService.changeApplicantStatus(applicant2.id, tenantId, 'UNDER_REVIEW', userId, userEmail);

  // Accept Applicant 1
  await admissionDecisionService.submitDecision(
    tenantId,
    applicant.id,
    {
      decision: 'ACCEPTED',
      reason: 'Dossier académique et test d\'entrée excellents.',
    },
    userId,
    userEmail
  );

  // Put Applicant 2 on Waiting List
  await admissionDecisionService.submitDecision(
    tenantId,
    applicant2.id,
    {
      decision: 'WAITING_LIST',
      reason: 'Capacité atteinte provisoirement.',
      waitingListRank: 1,
    },
    userId,
    userEmail
  );

  const waitingList = await waitingListService.getWaitingList(tenantId, campaign.id);
  if (waitingList.length !== 1 || waitingList[0].id !== applicant2.id) {
    throw new Error('Waiting list filtering failed');
  }

  // Promote Applicant 2 from Waiting List
  await waitingListService.promoteFromWaitingList(tenantId, applicant2.id, userId, userEmail);
  const updatedApp2 = await applicantService.getApplicantById(applicant2.id, tenantId);
  if (updatedApp2.status !== 'ACCEPTED') {
    throw new Error('Waiting list promotion failed');
  }
  console.log('  ✓ Admission Decisions submitted and Waiting List promotion verified.');

  // 9. Enrollment Workflow & Student Generation
  console.log('9. Testing Enrollment Workflow & Student Generation...');
  const enrolledStudent = await enrollmentService.enrollApplicant(
    tenantId,
    applicant.id,
    {
      customEnrollmentNumber: 'STUD-2025-00001',
    },
    userId,
    userEmail
  );

  if (!enrolledStudent.enrollmentNumber || enrolledStudent.enrollmentNumber !== 'STUD-2025-00001') {
    throw new Error('Enrolled student creation failed');
  }

  const finalApplicantState = await applicantService.getApplicantById(applicant.id, tenantId);
  if (finalApplicantState.status !== 'ENROLLED') {
    throw new Error('Applicant status must be updated to ENROLLED upon enrollment');
  }

  const studentList = await enrollmentService.getEnrolledStudents(tenantId, {});
  if (studentList.total !== 1) {
    throw new Error('Enrolled student not found in repository');
  }
  console.log(`  ✓ Enrolled Student created successfully. Enrollment Number: ${enrolledStudent.enrollmentNumber}`);

  // 10. CSV Import / Export
  console.log('10. Testing CSV Import and Export...');
  const csvData = `firstName,lastName,dateOfBirth,gender,nationality,email,phone,guardianName,guardianPhone
Yasmine,Tazi,2014-11-05,FEMALE,Marocaine,yasmine@example.com,0663334455,Nabil Tazi,0664445566
Omar,Idrissi,2014-04-18,MALE,Marocaine,omar@example.com,0665556677,Houda Idrissi,0666667788`;

  const importResult = await admissionsImportExportService.importApplicantsCsv(
    tenantId,
    csvData,
    campaign.id,
    period.id,
    academicYearId,
    'grade_6th',
    userId,
    userEmail
  );

  if (importResult.importedCount !== 2) {
    throw new Error(`CSV Import failed. Imported: ${importResult.importedCount}`);
  }

  const exportedCsv = await admissionsImportExportService.exportApplicantsCsv(tenantId, campaign.id);
  if (!exportedCsv.includes('Yasmine') || !exportedCsv.includes('Adam')) {
    throw new Error('CSV Export failed to produce valid CSV data');
  }
  console.log('  ✓ CSV Import and Export verified successfully.');

  // 11. Notifications Architecture & Activity Timeline Audit Logs
  console.log('11. Testing Notifications Architecture and Activity Timeline...');
  const notifications = await admissionsNotificationService.getNotificationsForTenant(tenantId);
  if (notifications.length === 0) {
    throw new Error('Notifications should have been emitted for admissions events');
  }

  const timeline = await admissionsActivityService.getEntityActivityTimeline(tenantId);
  if (timeline.length === 0) {
    throw new Error('Activity timeline audit logs should exist for admissions domain');
  }
  console.log(`  ✓ Notifications count: ${notifications.length}. Activity audit logs count: ${timeline.length}`);

  console.log('\n✅ ALL ADMISSIONS DOMAIN VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
}
