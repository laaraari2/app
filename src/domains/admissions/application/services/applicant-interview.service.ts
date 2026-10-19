import { applicantRepository } from '../../infrastructure/persistence/applicant.repository';
import { applicantService } from './applicant.service';
import { ApplicantInterview } from '../../domain/entities/admissions-types';
import { ScheduleInterviewDto, EvaluateInterviewDto } from '../../dto/admissions.dto';
import { NotFoundError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';
import { scheduleInterviewSchema, evaluateInterviewSchema } from '../../validators/admissions.validator';

export class ApplicantInterviewService {
  public async scheduleInterview(
    tenantId: string,
    applicantId: string,
    dto: ScheduleInterviewDto,
    userId?: string,
    userEmail?: string
  ): Promise<ApplicantInterview> {
    const applicant = await applicantService.getApplicantById(applicantId, tenantId);
    const validated = scheduleInterviewSchema.parse(dto);

    const interview: ApplicantInterview = {
      id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      applicantId: applicant.id,
      scheduledAt: new Date(validated.scheduledAt),
      location: validated.location,
      interviewerName: validated.interviewerName,
      interviewerNotes: validated.interviewerNotes,
      status: 'SCHEDULED',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
    };

    const saved = await applicantRepository.saveInterview(interview);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_INTERVIEW_SCHEDULE',
      resource: 'admissions:interview',
      resourceId: saved.id,
      details: { applicantId, scheduledAt: saved.scheduledAt },
    });

    return saved;
  }

  public async getApplicantInterviews(tenantId: string, applicantId: string): Promise<ApplicantInterview[]> {
    await applicantService.getApplicantById(applicantId, tenantId);
    return applicantRepository.getInterviewsByApplicantId(applicantId, tenantId);
  }

  public async evaluateInterview(
    tenantId: string,
    interviewId: string,
    dto: EvaluateInterviewDto,
    userId?: string,
    userEmail?: string
  ): Promise<ApplicantInterview> {
    const interview = await applicantRepository.findInterviewById(interviewId, tenantId);
    if (!interview || interview.isDeleted) {
      throw new NotFoundError(`Interview with ID '${interviewId}' not found.`);
    }

    const validated = evaluateInterviewSchema.parse(dto);

    if (validated.score !== undefined) interview.score = validated.score;
    if (validated.recommendation !== undefined) interview.recommendation = validated.recommendation;
    if (validated.interviewerNotes !== undefined) interview.interviewerNotes = validated.interviewerNotes;
    if (validated.status !== undefined) interview.status = validated.status;
    else interview.status = 'COMPLETED';

    interview.updatedAt = new Date();
    interview.updatedBy = userId;

    const saved = await applicantRepository.saveInterview(interview);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_INTERVIEW_EVALUATE',
      resource: 'admissions:interview',
      resourceId: saved.id,
      details: { score: saved.score, recommendation: saved.recommendation },
    });

    return saved;
  }
}

export const applicantInterviewService = new ApplicantInterviewService();
