import { DayOfWeek, EventType, TermType, TermStatus } from '../domain/entities/academic-types';

export interface CreateAcademicYearDto {
  name: string;
  code: string;
  startDate: string | Date;
  endDate: string | Date;
  isCurrent?: boolean;
  status?: 'UPCOMING' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
}

export interface CreateAcademicTermDto {
  academicYearId: string;
  name: string;
  code: string;
  type: TermType;
  sequence: number;
  startDate: string | Date;
  endDate: string | Date;
  weightPercentage: number;
  status?: TermStatus;
}

export interface CreateEducationalStageDto {
  code: string;
  name: string;
  description?: string;
  minAge?: number;
  maxAge?: number;
  displayOrder?: number;
}

export interface CreateGradeLevelDto {
  stageId: string;
  code: string;
  name: string;
  sequence: number;
  minAge?: number;
  passingGrade?: number;
}

export interface CreateClassGroupDto {
  gradeId: string;
  academicYearId: string;
  campusId?: string;
  code: string;
  name: string;
  roomAssignmentId?: string;
  maxCapacity: number;
}

export interface CreateSubjectCategoryDto {
  code: string;
  name: string;
  description?: string;
  colorCode?: string;
}

export interface CreateSubjectDto {
  categoryId: string;
  code: string;
  name: string;
  description?: string;
  credits?: number;
  weeklyHours?: number;
  passesThreshold?: number;
}

export interface CreateCurriculumDto {
  gradeId: string;
  subjectId: string;
  academicYearId?: string;
  weeklyHours: number;
  coefficient: number;
  evaluationType?: 'EXAM' | 'CONTINUOUS' | 'PRACTICAL' | 'HYBRID';
  learningObjectives?: string[];
  syllabusUrl?: string;
}

export interface CreateTeachingAssignmentDto {
  academicYearId: string;
  classGroupId: string;
  subjectId: string;
  teacherId: string;
  teacherName?: string;
  termId?: string;
  weeklyHours: number;
}

export interface CreateTimetableSlotDto {
  academicYearId: string;
  campusId: string;
  classGroupId: string;
  subjectId?: string;
  teacherId?: string;
  roomId?: string;
  termId?: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakType?: 'RECESS' | 'LUNCH' | 'PRAYER' | 'ASSEMBLY';
}

export interface CreateSchoolCalendarDto {
  academicYearId: string;
  campusId?: string;
  name: string;
  code: string;
  description?: string;
  timeZone?: string;
  workingDays?: DayOfWeek[];
  dailyStartTime?: string;
  dailyEndTime?: string;
  isDefault?: boolean;
}

export interface CreateAcademicEventDto {
  calendarId?: string;
  academicYearId: string;
  campusId?: string;
  title: string;
  eventType: EventType;
  startDate: string | Date;
  endDate: string | Date;
  description?: string;
  affectsAttendance?: boolean;
  isGlobal?: boolean;
}
