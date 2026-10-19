import {
  CampaignStatus,
  PeriodStatus,
  ApplicantStatus,
  Gender,
  GuardianInfo,
  DocumentType,
  DocumentStatus,
  InterviewStatus,
  InterviewRecommendation,
  DecisionType,
} from '../domain/entities/admissions-types';

export interface CreateAdmissionCampaignDto {
  academicYearId: string;
  code: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: CampaignStatus;
  maxCapacity?: number;
}

export interface UpdateAdmissionCampaignDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: CampaignStatus;
  maxCapacity?: number;
}

export interface CreateRegistrationPeriodDto {
  campaignId: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  targetGradeIds: string[];
  maxApplicants?: number;
  status?: PeriodStatus;
}

export interface UpdateRegistrationPeriodDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  targetGradeIds?: string[];
  maxApplicants?: number;
  status?: PeriodStatus;
}

export interface CreateApplicantDto {
  campaignId: string;
  periodId: string;
  academicYearId: string;
  targetGradeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  nationalId?: string;
  email?: string;
  phone?: string;
  currentSchool?: string;
  guardians: Omit<GuardianInfo, 'id'>[];
  notes?: string;
}

export interface UpdateApplicantDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  nationalId?: string;
  email?: string;
  phone?: string;
  currentSchool?: string;
  targetGradeId?: string;
  guardians?: GuardianInfo[];
  notes?: string;
  status?: ApplicantStatus;
}

export interface UploadApplicantDocumentDto {
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
}

export interface VerifyApplicantDocumentDto {
  status: DocumentStatus;
  rejectionReason?: string;
}

export interface ScheduleInterviewDto {
  scheduledAt: string;
  location?: string;
  interviewerName?: string;
  interviewerNotes?: string;
}

export interface EvaluateInterviewDto {
  score?: number;
  recommendation?: InterviewRecommendation;
  interviewerNotes?: string;
  status?: InterviewStatus;
}

export interface ScheduleExamDto {
  examName: string;
  examDate: string;
  maxScore: number;
}

export interface EvaluateExamDto {
  scoreObtained: number;
  passed: boolean;
  comments?: string;
}

export interface SubmitAdmissionDecisionDto {
  decision: DecisionType;
  reason?: string;
  waitingListRank?: number;
}

export interface EnrollApplicantDto {
  customEnrollmentNumber?: string;
  classGroupId?: string;
}

export interface BulkApplicantActionDto {
  ids: string[];
  action: 'delete' | 'restore' | 'update_status';
  targetStatus?: ApplicantStatus;
}
