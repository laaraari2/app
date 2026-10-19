import { applicantService } from './applicant.service';
import { enrolledStudentRepository } from '../../infrastructure/persistence/enrolled-student.repository';
import { EnrolledStudent, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/admissions-types';
import { EnrollApplicantDto } from '../../dto/admissions.dto';
import { ApplicantNotApprovedError } from '../../domain/errors/admissions-domain.error';
import { EnrollmentNumber } from '../../domain/value-objects/enrollment-number.vo';
import { auditService } from '../../../../services/audit.service';
import { admissionsNotificationService } from './admissions-notification.service';

export class EnrollmentService {
  public async enrollApplicant(
    tenantId: string,
    applicantId: string,
    dto: EnrollApplicantDto = {},
    userId?: string,
    userEmail?: string
  ): Promise<EnrolledStudent> {
    // 1. Fetch applicant
    const applicant = await applicantService.getApplicantById(applicantId, tenantId);

    // 2. Strict Rule: Applicant must be ACCEPTED
    if (applicant.status !== 'ACCEPTED') {
      throw new ApplicantNotApprovedError(applicant.status);
    }

    // 3. Generate unique Enrollment Number
    let enrollmentNumberStr = dto.customEnrollmentNumber;
    if (!enrollmentNumberStr) {
      const seq = await enrolledStudentRepository.getNextEnrollmentSequence(tenantId, applicant.academicYearId);
      const yearMatch = applicant.academicYearId?.match(/\d{4}/);
      const yearCode = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
      enrollmentNumberStr = EnrollmentNumber.generate(yearCode, seq).getValue();
    } else {
      enrollmentNumberStr = new EnrollmentNumber(enrollmentNumberStr).getValue();
    }

    // 4. Create EnrolledStudent record (Crucial: Applicant transforms into Enrolled Student)
    const student: EnrolledStudent = {
      id: `stud_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      applicantId: applicant.id,
      enrollmentNumber: enrollmentNumberStr,
      academicYearId: applicant.academicYearId,
      gradeLevelId: applicant.targetGradeId,
      classGroupId: dto.classGroupId,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      dateOfBirth: applicant.dateOfBirth,
      gender: applicant.gender,
      nationalId: applicant.nationalId,
      enrollmentDate: new Date(),
      guardians: applicant.guardians,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
    };

    const savedStudent = await enrolledStudentRepository.save(student);

    // 5. Update Applicant status to ENROLLED
    await applicantService.changeApplicantStatus(applicant.id, tenantId, 'ENROLLED', userId, userEmail);

    // 6. Notify Parent / Student
    const primaryGuardian = applicant.guardians.find(g => g.isPrimary) || applicant.guardians[0];
    await admissionsNotificationService.emitNotification(
      tenantId,
      'ENROLLMENT_CONFIRMED',
      'Inscription Confirmée!',
      `L'inscription de ${applicant.firstName} ${applicant.lastName} est définitivement confirmée. Matricule Élève: ${savedStudent.enrollmentNumber}.`,
      primaryGuardian?.email || applicant.email,
      primaryGuardian?.phone || applicant.phone,
      { studentId: savedStudent.id, enrollmentNumber: savedStudent.enrollmentNumber }
    );

    // 7. Audit log
    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_ENROLL_CONFIRM',
      resource: 'admissions:student',
      resourceId: savedStudent.id,
      details: { enrollmentNumber: savedStudent.enrollmentNumber, applicantId: applicant.id },
    });

    return savedStudent;
  }

  public async getEnrolledStudents(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<EnrolledStudent>> {
    return enrolledStudentRepository.getPaginated(tenantId, options);
  }

  public async getEnrolledStudentById(id: string, tenantId: string): Promise<EnrolledStudent> {
    const student = await enrolledStudentRepository.findById(id, tenantId);
    if (!student || student.isDeleted) {
      throw new Error(`Enrolled student with ID '${id}' not found.`);
    }
    return student;
  }
}

export const enrollmentService = new EnrollmentService();
