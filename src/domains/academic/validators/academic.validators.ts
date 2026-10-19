import { z } from 'zod';

export const createAcademicYearSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(50),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isCurrent: z.boolean().optional(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'ARCHIVED', 'CLOSED']).optional(),
});

export const updateAcademicYearSchema = createAcademicYearSchema.partial();

export const createAcademicTermSchema = z.object({
  academicYearId: z.string().min(1),
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(50),
  type: z.enum(['SEMESTER', 'TRIMESTER', 'QUARTER']),
  sequence: z.number().int().min(1),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  weightPercentage: z.number().min(0).max(100),
  status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
});

export const updateAcademicTermSchema = createAcademicTermSchema.partial();

export const createEducationalStageSchema = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  minAge: z.number().min(2).max(25).optional(),
  maxAge: z.number().min(2).max(30).optional(),
  displayOrder: z.number().int().optional(),
});

export const updateEducationalStageSchema = createEducationalStageSchema.partial();

export const createGradeLevelSchema = z.object({
  stageId: z.string().min(1),
  code: z.string().min(1).max(50),
  name: z.string().min(2).max(100),
  sequence: z.number().int().min(1),
  minAge: z.number().optional(),
  passingGrade: z.number().min(0).max(100).optional(),
});

export const updateGradeLevelSchema = createGradeLevelSchema.partial();

export const createClassGroupSchema = z.object({
  gradeId: z.string().min(1),
  academicYearId: z.string().min(1),
  campusId: z.string().optional(),
  code: z.string().min(1).max(50),
  name: z.string().min(2).max(100),
  roomAssignmentId: z.string().optional(),
  maxCapacity: z.number().int().min(1).max(200),
});

export const updateClassGroupSchema = createClassGroupSchema.partial();

export const createSubjectCategorySchema = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  colorCode: z.string().optional(),
});

export const updateSubjectCategorySchema = createSubjectCategorySchema.partial();

export const createSubjectSchema = z.object({
  categoryId: z.string().min(1),
  code: z.string().min(1).max(50),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  credits: z.number().min(0).optional(),
  weeklyHours: z.number().min(0).optional(),
  passesThreshold: z.number().min(0).max(100).optional(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export const createCurriculumSchema = z.object({
  gradeId: z.string().min(1),
  subjectId: z.string().min(1),
  academicYearId: z.string().optional(),
  weeklyHours: z.number().min(0.5).max(40),
  coefficient: z.number().min(0.1).max(20),
  evaluationType: z.enum(['EXAM', 'CONTINUOUS', 'PRACTICAL', 'HYBRID']).optional(),
  learningObjectives: z.array(z.string()).optional(),
  syllabusUrl: z.string().optional(),
});

export const updateCurriculumSchema = createCurriculumSchema.partial();

export const createTeachingAssignmentSchema = z.object({
  academicYearId: z.string().min(1),
  classGroupId: z.string().min(1),
  subjectId: z.string().min(1),
  teacherId: z.string().min(1),
  teacherName: z.string().optional(),
  termId: z.string().optional(),
  weeklyHours: z.number().min(0.5).max(40),
});

export const updateTeachingAssignmentSchema = createTeachingAssignmentSchema.partial();

export const createTimetableSlotSchema = z.object({
  academicYearId: z.string().min(1),
  campusId: z.string().min(1),
  classGroupId: z.string().min(1),
  subjectId: z.string().optional(),
  teacherId: z.string().optional(),
  roomId: z.string().optional(),
  termId: z.string().optional(),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  periodNumber: z.number().int().min(1).max(12),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  isBreak: z.boolean().optional(),
  breakType: z.enum(['RECESS', 'LUNCH', 'PRAYER', 'ASSEMBLY']).optional(),
});

export const updateTimetableSlotSchema = createTimetableSlotSchema.partial();

export const createSchoolCalendarSchema = z.object({
  academicYearId: z.string().min(1),
  campusId: z.string().optional(),
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(50),
  description: z.string().optional(),
  timeZone: z.string().optional(),
  workingDays: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])).optional(),
  dailyStartTime: z.string().optional(),
  dailyEndTime: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const updateSchoolCalendarSchema = createSchoolCalendarSchema.partial();

export const createAcademicEventSchema = z.object({
  calendarId: z.string().optional(),
  academicYearId: z.string().min(1),
  campusId: z.string().optional(),
  title: z.string().min(2).max(150),
  eventType: z.enum(['HOLIDAY', 'NATIONAL_HOLIDAY', 'EXAM_PERIOD', 'EVENT', 'ACADEMIC_DEADLINE']),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  description: z.string().optional(),
  affectsAttendance: z.boolean().optional(),
  isGlobal: z.boolean().optional(),
});

export const updateAcademicEventSchema = createAcademicEventSchema.partial();
