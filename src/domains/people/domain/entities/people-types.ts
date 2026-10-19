export type StaffRole =
  | 'ADMINISTRATOR'
  | 'TEACHER'
  | 'TEACHER_VACATAIRE'
  | 'ACCOUNTANT'
  | 'SECRETARY'
  | 'LIBRARIAN'
  | 'IT_SUPPORT'
  | 'BUS_DRIVER'
  | 'BUS_ATTENDANT'
  | 'MATERNELLE_ASSISTANT'
  | 'CLEANING_STAFF'
  | 'SECURITY_AGENT'
  | 'MAINTENANCE'
  | 'OTHER';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'HOURLY_VACATION';

export type ContractType = 'CDI' | 'CDD' | 'VACATION' | 'ANAPEC';

export type StaffStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';

export type StudentProfileStatus =
  | 'ACTIVE'
  | 'GRADUATED'
  | 'TRANSFERRED'
  | 'SUSPENDED'
  | 'WITHDRAWN';

export type RelationType =
  | 'FATHER'
  | 'MOTHER'
  | 'STEP_PARENT'
  | 'GRANDPARENT'
  | 'LEGAL_GUARDIAN'
  | 'OTHER';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface StaffMember {
  id: string;
  tenantId: string;
  campusId?: string;
  employeeId: string;
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
  contractType?: ContractType;
  cnssNumber?: string;
  hourlyRate?: number; // In MAD for vacataires / public teachers
  assignedZone?: string; // e.g. for femmes de ménage (wing / floor)
  busId?: string; // for drivers & attendants
  replacementStaffId?: string; // In case of absence
  leaveReason?: string;
  status: StaffStatus;
  joinDate: string | Date;
  salary?: number;
  userId?: string; // Link to system User account
  emergencyContact?: EmergencyContact;
  documents?: { title: string; url: string; uploadedAt: string | Date }[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface TeacherProfile {
  id: string;
  tenantId: string;
  staffMemberId: string; // Links to StaffMember
  specialization: string;
  qualification: string;
  subjectIds: string[]; // List of subject IDs taught
  campusIds: string[];
  maxWeeklyHours: number;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

export interface StudentProfile {
  id: string;
  tenantId: string;
  campusId: string;
  enrolledStudentId?: string; // Link to Admissions EnrolledStudent
  studentNumber: string;
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
  status: StudentProfileStatus;
  joinDate: string | Date;
  address?: string;
  emergencyContact?: EmergencyContact;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface GuardianProfile {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  occupation?: string;
  employer?: string;
  address?: string;
  userId?: string; // Optional parent portal user
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

export interface PersonRelationship {
  id: string;
  tenantId: string;
  guardianId: string;
  studentProfileId: string;
  relationType: RelationType;
  isPrimaryContact: boolean;
  isEmergencyContact: boolean;
  canPickup: boolean;
  isFinancialResponsible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
