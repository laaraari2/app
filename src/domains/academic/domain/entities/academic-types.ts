export interface AcademicBaseEntity {
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

export type AcademicYearStatus = 'UPCOMING' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED' | 'INACTIVE';

export interface AcademicYear extends AcademicBaseEntity {
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  status: AcademicYearStatus;
  settings?: Record<string, any>;
}

export type TermType = 'SEMESTER' | 'TRIMESTER' | 'QUARTER';
export type TermStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface AcademicTerm extends AcademicBaseEntity {
  academicYearId: string;
  name: string;
  code: string;
  type: TermType;
  sequence: number;
  startDate: Date;
  endDate: Date;
  weightPercentage: number;
  status: TermStatus;
}

export interface EducationalStage extends AcademicBaseEntity {
  code: string; // e.g. "PRIMARY", "MIDDLE", "HIGH"
  name: string; // e.g. "Enseignement Primaire", "Collège", "Lycée"
  description?: string;
  minAge?: number;
  maxAge?: number;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface GradeLevel extends AcademicBaseEntity {
  stageId: string;
  code: string; // e.g. "G1", "G10", "1BAC"
  name: string; // e.g. "1ère Année Baccalauréat"
  sequence: number;
  minAge?: number;
  passingGrade?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ClassGroup extends AcademicBaseEntity {
  gradeId: string;
  academicYearId: string;
  campusId?: string;
  code: string; // e.g. "1BAC-S1"
  name: string; // e.g. "1ère BAC Sciences Mathématiques A"
  roomAssignmentId?: string;
  maxCapacity: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SubjectCategory extends AcademicBaseEntity {
  code: string; // e.g. "STEM", "LANG", "HUMANITIES"
  name: string; // e.g. "Sciences & Technologies"
  description?: string;
  colorCode?: string;
}

export interface Subject extends AcademicBaseEntity {
  categoryId: string;
  code: string; // e.g. "MATH-101", "PHY-201"
  name: string; // e.g. "Mathématiques"
  description?: string;
  credits?: number;
  weeklyHours?: number;
  passesThreshold?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Curriculum extends AcademicBaseEntity {
  gradeId: string;
  subjectId: string;
  academicYearId?: string;
  weeklyHours: number;
  coefficient: number;
  evaluationType?: 'EXAM' | 'CONTINUOUS' | 'PRACTICAL' | 'HYBRID';
  learningObjectives?: string[];
  syllabusUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TeachingAssignment extends AcademicBaseEntity {
  academicYearId: string;
  classGroupId: string;
  subjectId: string;
  teacherId: string; // Teacher reference ID / placeholder
  teacherName?: string;
  termId?: string;
  weeklyHours: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimetableSlot extends AcademicBaseEntity {
  academicYearId: string;
  campusId: string;
  classGroupId: string;
  subjectId?: string;
  teacherId?: string;
  roomId?: string;
  termId?: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string; // "08:30"
  endTime: string;   // "09:30"
  isBreak: boolean;
  breakType?: 'RECESS' | 'LUNCH' | 'PRAYER' | 'ASSEMBLY';
}

export interface SchoolCalendar extends AcademicBaseEntity {
  academicYearId: string;
  campusId?: string;
  name: string;
  code: string;
  description?: string;
  timeZone: string;
  workingDays: DayOfWeek[];
  dailyStartTime: string; // "08:00"
  dailyEndTime: string;   // "17:00"
  isDefault: boolean;
}

export type EventType = 'HOLIDAY' | 'NATIONAL_HOLIDAY' | 'EXAM_PERIOD' | 'EVENT' | 'ACADEMIC_DEADLINE';

export interface AcademicEvent extends AcademicBaseEntity {
  calendarId?: string;
  academicYearId: string;
  campusId?: string;
  title: string;
  eventType: EventType;
  startDate: Date;
  endDate: Date;
  description?: string;
  affectsAttendance: boolean;
  isGlobal: boolean;
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  includeDeleted?: boolean;
  includeArchived?: boolean;
  stageId?: string;
  gradeId?: string;
  academicYearId?: string;
  campusId?: string;
  categoryId?: string;
  classGroupId?: string;
  subjectId?: string;
  teacherId?: string;
  eventType?: EventType;
}
