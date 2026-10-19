import { Tenant, User, Role, Permission, RefreshToken, AuditLog } from '../types/auth';
import { School, Campus, Building, Floor, Room } from '../types/organization';
import { PlatformSettings, TenantSettings, CampusSettings, AcademicYearSettings } from '../types/settings';
import {
  AcademicYear,
  AcademicTerm,
  EducationalStage,
  GradeLevel,
  ClassGroup,
  SubjectCategory,
  Subject,
  Curriculum,
  TeachingAssignment,
  TimetableSlot,
  SchoolCalendar,
  AcademicEvent,
} from '../domains/academic/domain/entities/academic-types';

import {
  AdmissionCampaign,
  RegistrationPeriod,
  Applicant,
  ApplicantDocument,
  ApplicantInterview,
  ApplicantExam,
  AdmissionDecision,
  EnrolledStudent,
  NotificationPayload,
} from '../domains/admissions/domain/entities/admissions-types';

import {
  StaffMember,
  TeacherProfile,
  StudentProfile,
  GuardianProfile,
  PersonRelationship,
} from '../domains/people/domain/entities/people-types';

import {
  DomainEvent,
  OutboxMessage,
  WorkflowDefinition,
  WorkflowExecution,
} from '../domains/workflow/domain/entities/event-types';

export class DataStore {
  private static instance: DataStore;

  public tenants: Map<string, Tenant> = new Map();
  public users: Map<string, User> = new Map();
  public roles: Map<string, Role> = new Map();
  public permissions: Map<string, Permission> = new Map();
  public refreshTokens: Map<string, RefreshToken> = new Map();
  public auditLogs: Map<string, AuditLog> = new Map();

  // Workflow & Domain Events Collections
  public outboxMessages: Map<string, OutboxMessage> = new Map();
  public domainEventLogs: Map<string, DomainEvent> = new Map();
  public workflowDefinitions: Map<string, WorkflowDefinition> = new Map();
  public workflowExecutions: Map<string, WorkflowExecution> = new Map();
  public processedEventIds: Set<string> = new Set();

  // Academic Domain Collections
  public academicYears: Map<string, AcademicYear> = new Map();
  public academicTerms: Map<string, AcademicTerm> = new Map();
  public educationalStages: Map<string, EducationalStage> = new Map();
  public gradeLevels: Map<string, GradeLevel> = new Map();
  public classGroups: Map<string, ClassGroup> = new Map();
  public subjectCategories: Map<string, SubjectCategory> = new Map();
  public subjects: Map<string, Subject> = new Map();
  public curriculums: Map<string, Curriculum> = new Map();
  public teachingAssignments: Map<string, TeachingAssignment> = new Map();
  public timetableSlots: Map<string, TimetableSlot> = new Map();
  public schoolCalendars: Map<string, SchoolCalendar> = new Map();
  public academicEvents: Map<string, AcademicEvent> = new Map();

  // Admissions Domain Collections
  public admissionCampaigns: Map<string, AdmissionCampaign> = new Map();
  public registrationPeriods: Map<string, RegistrationPeriod> = new Map();
  public applicants: Map<string, Applicant> = new Map();
  public applicantDocuments: Map<string, ApplicantDocument> = new Map();
  public applicantInterviews: Map<string, ApplicantInterview> = new Map();
  public applicantExams: Map<string, ApplicantExam> = new Map();
  public admissionDecisions: Map<string, AdmissionDecision> = new Map();
  public enrolledStudents: Map<string, EnrolledStudent> = new Map();
  public notifications: Map<string, NotificationPayload> = new Map();

  // Organization Structure
  public schools: Map<string, School> = new Map();
  public campuses: Map<string, Campus> = new Map();
  public buildings: Map<string, Building> = new Map();
  public floors: Map<string, Floor> = new Map();
  public rooms: Map<string, Room> = new Map();

  // Refactored Settings Sections
  public platformSettings: Map<string, PlatformSettings> = new Map();
  public tenantSettings: Map<string, TenantSettings> = new Map();
  public campusSettings: Map<string, CampusSettings> = new Map();
  public academicYearSettings: Map<string, AcademicYearSettings> = new Map();

  // People Domain Collections
  public staffMembers: Map<string, StaffMember> = new Map();
  public teacherProfiles: Map<string, TeacherProfile> = new Map();
  public studentProfiles: Map<string, StudentProfile> = new Map();
  public guardianProfiles: Map<string, GuardianProfile> = new Map();
  public personRelationships: Map<string, PersonRelationship> = new Map();

  private constructor() {}

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  public reset(): void {
    this.tenants.clear();
    this.users.clear();
    this.roles.clear();
    this.permissions.clear();
    this.refreshTokens.clear();
    this.auditLogs.clear();

    this.outboxMessages.clear();
    this.domainEventLogs.clear();
    this.workflowDefinitions.clear();
    this.workflowExecutions.clear();
    this.processedEventIds.clear();

    this.academicYears.clear();
    this.academicTerms.clear();
    this.educationalStages.clear();
    this.gradeLevels.clear();
    this.classGroups.clear();
    this.subjectCategories.clear();
    this.subjects.clear();
    this.curriculums.clear();
    this.teachingAssignments.clear();
    this.timetableSlots.clear();
    this.schoolCalendars.clear();
    this.academicEvents.clear();

    this.admissionCampaigns.clear();
    this.registrationPeriods.clear();
    this.applicants.clear();
    this.applicantDocuments.clear();
    this.applicantInterviews.clear();
    this.applicantExams.clear();
    this.admissionDecisions.clear();
    this.enrolledStudents.clear();
    this.notifications.clear();

    this.schools.clear();
    this.campuses.clear();
    this.buildings.clear();
    this.floors.clear();
    this.rooms.clear();

    this.platformSettings.clear();
    this.tenantSettings.clear();
    this.campusSettings.clear();
    this.academicYearSettings.clear();

    this.staffMembers.clear();
    this.teacherProfiles.clear();
    this.studentProfiles.clear();
    this.guardianProfiles.clear();
    this.personRelationships.clear();
  }
}

export const db = DataStore.getInstance();
