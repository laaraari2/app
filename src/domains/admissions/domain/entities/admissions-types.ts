export interface AdmissionsBaseEntity {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  isArchived?: boolean;
  archivedAt?: Date;
  archivedBy?: string;
}

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export interface AdmissionCampaign extends AdmissionsBaseEntity {
  academicYearId: string;
  code: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  maxCapacity?: number;
}

export type PeriodStatus = 'UPCOMING' | 'OPEN' | 'CLOSED';

export interface RegistrationPeriod extends AdmissionsBaseEntity {
  campaignId: string;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  targetGradeIds: string[];
  maxApplicants?: number;
  status: PeriodStatus;
}

export type GuardianRelation = 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';

export interface GuardianInfo {
  id: string;
  relation: GuardianRelation;
  fullName: string;
  phone: string;
  email?: string;
  profession?: string;
  nationalId?: string;
  isPrimary: boolean;
}

export type ApplicantStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'WAITING_DOCUMENTS'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WAITING_LIST'
  | 'ENROLLED'
  | 'CANCELLED';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Applicant extends AdmissionsBaseEntity {
  campaignId: string;
  periodId: string;
  academicYearId: string;
  targetGradeId: string;
  applicationNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality: string;
  nationalId?: string;
  email?: string;
  phone?: string;
  currentSchool?: string;
  status: ApplicantStatus;
  guardians: GuardianInfo[];
  notes?: string;
  submittedAt?: Date;
}

export type DocumentType =
  | 'BIRTH_CERTIFICATE'
  | 'TRANSCRIPT'
  | 'ID_CARD'
  | 'PHOTO'
  | 'MEDICAL_CERTIFICATE'
  | 'RECOMMENDATION_LETTER'
  | 'OTHER';

export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface ApplicantDocument extends AdmissionsBaseEntity {
  applicantId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  status: DocumentStatus;
  rejectionReason?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type InterviewRecommendation = 'RECOMMENDED' | 'NEUTRAL' | 'NOT_RECOMMENDED';

export interface ApplicantInterview extends AdmissionsBaseEntity {
  applicantId: string;
  scheduledAt: Date;
  location?: string;
  interviewerName?: string;
  interviewerNotes?: string;
  score?: number;
  recommendation?: InterviewRecommendation;
  status: InterviewStatus;
}

export interface ApplicantExam extends AdmissionsBaseEntity {
  applicantId: string;
  examName: string;
  examDate: Date;
  maxScore: number;
  scoreObtained?: number;
  passed?: boolean;
  comments?: string;
}

export type DecisionType = 'ACCEPTED' | 'REJECTED' | 'WAITING_LIST';

export interface AdmissionDecision extends AdmissionsBaseEntity {
  applicantId: string;
  decision: DecisionType;
  decisionDate: Date;
  decidedBy: string;
  decidedByName?: string;
  reason?: string;
  waitingListRank?: number;
}

export interface EnrolledStudent extends AdmissionsBaseEntity {
  applicantId: string;
  enrollmentNumber: string;
  academicYearId: string;
  gradeLevelId: string;
  classGroupId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  nationalId?: string;
  enrollmentDate: Date;
  guardians: GuardianInfo[];
  status: 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
}

export interface NotificationPayload {
  id: string;
  tenantId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  type: 'APPLICATION_SUBMITTED' | 'DOCUMENTS_REQUIRED' | 'DECISION_ISSUED' | 'ENROLLMENT_CONFIRMED' | 'WAITING_LIST_UPDATE';
  title: string;
  body: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationAndFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  campaignId?: string;
  periodId?: string;
  academicYearId?: string;
  targetGradeId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  includeArchived?: boolean;
}
