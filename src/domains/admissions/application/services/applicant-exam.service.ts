import { applicantRepository } from '../../infrastructure/persistence/applicant.repository';
import { applicantService } from './applicant.service';
import { ApplicantExam } from '../../domain/entities/admissions-types';
import { ScheduleExamDto, EvaluateExamDto } from '../../dto/admissions.dto';
import { auditService } from '../../../../services/audit.service';

export class ApplicantExamService {
  public async createExam(
    tenantId: string,
    applicantId: string,
    dto: ScheduleExamDto,
    userId?: string,
    userEmail?: string
  ): Promise<ApplicantExam> {
    const applicant = await applicantService.getApplicantById(applicantId, tenantId);

    const exam: ApplicantExam = {
      id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      applicantId: applicant.id,
      examName: dto.examName,
      examDate: new Date(dto.examDate),
      maxScore: dto.maxScore,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
    };

    const saved = await applicantRepository.saveExam(exam);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_EXAM_SCHEDULE',
      resource: 'admissions:exam',
      resourceId: saved.id,
      details: { applicantId, examName: saved.examName },
    });

    return saved;
  }

  public async evaluateExam(
    tenantId: string,
    examId: string,
    dto: EvaluateExamDto,
    userId?: string,
    userEmail?: string
  ): Promise<ApplicantExam> {
    let targetExam: ApplicantExam | null = null;
    for (const ex of (await applicantRepository.getExamsByApplicantId('', tenantId)) || []) {
      if (ex.id === examId) {
        targetExam = ex;
        break;
      }
    }

    if (!targetExam) {
      // Find directly in database store
      const { db } = await import('../../../../db/store');
      const ex = db.applicantExams.get(examId);
      if (!ex || ex.tenantId !== tenantId) {
        throw new Error(`Entrance exam with ID '${examId}' not found.`);
      }
      targetExam = ex;
    }

    targetExam.scoreObtained = dto.scoreObtained;
    targetExam.passed = dto.passed;
    targetExam.comments = dto.comments;
    targetExam.updatedAt = new Date();
    targetExam.updatedBy = userId;

    const saved = await applicantRepository.saveExam(targetExam);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_EXAM_EVALUATE',
      resource: 'admissions:exam',
      resourceId: saved.id,
      details: { scoreObtained: saved.scoreObtained, passed: saved.passed },
    });

    return saved;
  }

  public async getApplicantExams(tenantId: string, applicantId: string): Promise<ApplicantExam[]> {
    await applicantService.getApplicantById(applicantId, tenantId);
    return applicantRepository.getExamsByApplicantId(applicantId, tenantId);
  }
}

export const applicantExamService = new ApplicantExamService();
