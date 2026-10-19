import { z } from 'zod';

export const createCampaignSchema = z.object({
  academicYearId: z.string().min(1, 'Academic Year ID is required'),
  code: z.string().min(2, 'Campaign code must be at least 2 characters').toUpperCase(),
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid start date format'),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end date format'),
  status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED']).optional(),
  maxCapacity: z.number().int().positive().optional(),
});

export const createPeriodSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID is required'),
  code: z.string().min(2, 'Period code must be at least 2 characters').toUpperCase(),
  name: z.string().min(3, 'Period name must be at least 3 characters'),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid start date format'),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end date format'),
  targetGradeIds: z.array(z.string()).min(1, 'At least one target grade is required'),
  maxApplicants: z.number().int().positive().optional(),
  status: z.enum(['UPCOMING', 'OPEN', 'CLOSED']).optional(),
});

export const guardianSchema = z.object({
  relation: z.enum(['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']),
  fullName: z.string().min(2, 'Guardian full name is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  profession: z.string().optional(),
  nationalId: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const createApplicantSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID is required'),
  periodId: z.string().min(1, 'Registration period ID is required'),
  academicYearId: z.string().min(1, 'Academic year ID is required'),
  targetGradeId: z.string().min(1, 'Target grade ID is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date of birth'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  nationality: z.string().min(2, 'Nationality is required'),
  nationalId: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  currentSchool: z.string().optional(),
  guardians: z.array(guardianSchema).min(1, 'At least one parent/guardian is required'),
  notes: z.string().optional(),
});

export const uploadDocumentSchema = z.object({
  documentType: z.enum([
    'BIRTH_CERTIFICATE',
    'TRANSCRIPT',
    'ID_CARD',
    'PHOTO',
    'MEDICAL_CERTIFICATE',
    'RECOMMENDATION_LETTER',
    'OTHER',
  ]),
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().min(1, 'File URL is required'),
  fileSize: z.number().int().positive().optional(),
});

export const verifyDocumentSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

export const scheduleInterviewSchema = z.object({
  scheduledAt: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  location: z.string().optional(),
  interviewerName: z.string().optional(),
  interviewerNotes: z.string().optional(),
});

export const evaluateInterviewSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  recommendation: z.enum(['RECOMMENDED', 'NEUTRAL', 'NOT_RECOMMENDED']).optional(),
  interviewerNotes: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
});

export const submitDecisionSchema = z.object({
  decision: z.enum(['ACCEPTED', 'REJECTED', 'WAITING_LIST']),
  reason: z.string().optional(),
  waitingListRank: z.number().int().positive().optional(),
});

export const enrollApplicantSchema = z.object({
  customEnrollmentNumber: z.string().optional(),
  classGroupId: z.string().optional(),
});
