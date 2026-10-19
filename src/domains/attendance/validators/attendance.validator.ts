import { z } from 'zod';
import { AttendanceStatus } from '../domain/enums/AttendanceStatus';

export const recordAttendanceSchema = z.object({
  academicYearId: z.string().min(1, 'Academic Year ID is required'),
  campusId: z.string().min(1, 'Campus ID is required'),
  classGroupId: z.string().min(1, 'Class Group ID is required'),
  teacherAssignmentId: z.string().min(1, 'Teacher Assignment ID is required'),
  subjectId: z.string().min(1, 'Subject ID is required'),
  periodId: z.string().min(1, 'Period ID is required'),
  roomId: z.string().min(1, 'Room ID is required'),
  date: z.string().or(z.date()),
  records: z.array(
    z.object({
      studentId: z.string().min(1, 'Student ID is required'),
      status: z.nativeEnum(AttendanceStatus),
      notes: z.string().optional(),
    })
  ).min(1, 'At least one student record is required'),
});

export const correctAttendanceSchema = z.object({
  recordId: z.string().min(1, 'Record ID is required'),
  newStatus: z.nativeEnum(AttendanceStatus),
  reason: z.string().min(3, 'Correction reason must be at least 3 characters'),
});

export const approveAttendanceSchema = z.object({
  registerId: z.string().min(1, 'Register ID is required'),
});
