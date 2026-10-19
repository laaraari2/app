import {
  StaffRole,
  EmploymentType,
  StaffStatus,
  StudentProfileStatus,
  RelationType,
  EmergencyContact,
} from '../domain/entities/people-types';

export interface CreateStaffMemberDto {
  tenantId: string;
  campusId?: string;
  employeeId?: string; // Optional: auto-generated if omitted
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string | Date;
  address?: string;
  jobTitle: string;
  department: string;
  staffRole: StaffRole;
  employmentType: EmploymentType;
  contractType?: 'CDI' | 'CDD' | 'VACATION' | 'ANAPEC';
  cnssNumber?: string;
  hourlyRate?: number;
  assignedZone?: string;
  busId?: string;
  replacementStaffId?: string;
  leaveReason?: string;
  status?: StaffStatus;
  joinDate: string | Date;
  salary?: number;
  userId?: string;
  emergencyContact?: EmergencyContact;
}

export interface UpdateStaffMemberDto {
  campusId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  address?: string;
  jobTitle?: string;
  department?: string;
  staffRole?: StaffRole;
  employmentType?: EmploymentType;
  contractType?: 'CDI' | 'CDD' | 'VACATION' | 'ANAPEC';
  cnssNumber?: string;
  hourlyRate?: number;
  assignedZone?: string;
  busId?: string;
  replacementStaffId?: string;
  leaveReason?: string;
  status?: StaffStatus;
  salary?: number;
  userId?: string;
  emergencyContact?: EmergencyContact;
}

export interface CreateTeacherProfileDto {
  tenantId: string;
  staffMemberId: string;
  specialization: string;
  qualification: string;
  subjectIds?: string[];
  campusIds?: string[];
  maxWeeklyHours?: number;
  bio?: string;
}

export interface UpdateTeacherProfileDto {
  specialization?: string;
  qualification?: string;
  subjectIds?: string[];
  campusIds?: string[];
  maxWeeklyHours?: number;
  bio?: string;
}

export interface CreateStudentProfileDto {
  tenantId: string;
  campusId: string;
  enrolledStudentId?: string;
  studentNumber?: string; // Optional: auto-generated if omitted
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string | Date;
  gender: 'MALE' | 'FEMALE';
  bloodGroup?: string;
  medicalNotes?: string;
  dietaryRestrictions?: string;
  educationalStageId?: string;
  gradeLevelId?: string;
  classGroupId?: string;
  status?: StudentProfileStatus;
  joinDate: string | Date;
  address?: string;
  emergencyContact?: EmergencyContact;
}

export interface UpdateStudentProfileDto {
  campusId?: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  dietaryRestrictions?: string;
  educationalStageId?: string;
  gradeLevelId?: string;
  classGroupId?: string;
  status?: StudentProfileStatus;
  address?: string;
  emergencyContact?: EmergencyContact;
}

export interface CreateGuardianProfileDto {
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  occupation?: string;
  employer?: string;
  address?: string;
  userId?: string;
}

export interface UpdateGuardianProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  occupation?: string;
  employer?: string;
  address?: string;
  userId?: string;
}

export interface CreateRelationshipDto {
  tenantId: string;
  guardianId: string;
  studentProfileId: string;
  relationType: RelationType;
  isPrimaryContact?: boolean;
  isEmergencyContact?: boolean;
  canPickup?: boolean;
  isFinancialResponsible?: boolean;
}

export interface BulkActionDto {
  ids: string[];
  action: 'DELETE' | 'RESTORE' | 'ACTIVATE' | 'SUSPEND';
}
