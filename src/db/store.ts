import { PersistentMap, initializePersistence } from './persistence';
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

  public tenants: Map<string, Tenant> = new PersistentMap('tenants');
  public users: Map<string, User> = new PersistentMap('users');
  public roles: Map<string, Role> = new PersistentMap('roles');
  public permissions: Map<string, Permission> = new PersistentMap('permissions');
  public refreshTokens: Map<string, RefreshToken> = new PersistentMap('refreshTokens');
  public auditLogs: Map<string, AuditLog> = new PersistentMap('auditLogs');

  // Workflow & Domain Events Collections
  public outboxMessages: Map<string, OutboxMessage> = new PersistentMap('outboxMessages');
  public domainEventLogs: Map<string, DomainEvent> = new PersistentMap('domainEventLogs');
  public workflowDefinitions: Map<string, WorkflowDefinition> = new PersistentMap('workflowDefinitions');
  public workflowExecutions: Map<string, WorkflowExecution> = new PersistentMap('workflowExecutions');
  public processedEventIds: Set<string> = new Set();

  // Academic Domain Collections
  public academicYears: Map<string, AcademicYear> = new PersistentMap('academicYears');
  public academicTerms: Map<string, AcademicTerm> = new PersistentMap('academicTerms');
  public educationalStages: Map<string, EducationalStage> = new PersistentMap('educationalStages');
  public gradeLevels: Map<string, GradeLevel> = new PersistentMap('gradeLevels');
  public classGroups: Map<string, ClassGroup> = new PersistentMap('classGroups');
  public subjectCategories: Map<string, SubjectCategory> = new PersistentMap('subjectCategories');
  public subjects: Map<string, Subject> = new PersistentMap('subjects');
  public curriculums: Map<string, Curriculum> = new PersistentMap('curriculums');
  public teachingAssignments: Map<string, TeachingAssignment> = new PersistentMap('teachingAssignments');
  public timetableSlots: Map<string, TimetableSlot> = new PersistentMap('timetableSlots');
  public schoolCalendars: Map<string, SchoolCalendar> = new PersistentMap('schoolCalendars');
  public academicEvents: Map<string, AcademicEvent> = new PersistentMap('academicEvents');

  // Admissions Domain Collections
  public admissionCampaigns: Map<string, AdmissionCampaign> = new PersistentMap('admissionCampaigns');
  public registrationPeriods: Map<string, RegistrationPeriod> = new PersistentMap('registrationPeriods');
  public applicants: Map<string, Applicant> = new PersistentMap('applicants');
  public applicantDocuments: Map<string, ApplicantDocument> = new PersistentMap('applicantDocuments');
  public applicantInterviews: Map<string, ApplicantInterview> = new PersistentMap('applicantInterviews');
  public applicantExams: Map<string, ApplicantExam> = new PersistentMap('applicantExams');
  public admissionDecisions: Map<string, AdmissionDecision> = new PersistentMap('admissionDecisions');
  public enrolledStudents: Map<string, EnrolledStudent> = new PersistentMap('enrolledStudents');
  public notifications: Map<string, NotificationPayload> = new PersistentMap('notifications');

  // Organization Structure
  public schools: Map<string, School> = new PersistentMap('schools');
  public campuses: Map<string, Campus> = new PersistentMap('campuses');
  public buildings: Map<string, Building> = new PersistentMap('buildings');
  public floors: Map<string, Floor> = new PersistentMap('floors');
  public rooms: Map<string, Room> = new PersistentMap('rooms');

  // Refactored Settings Sections
  public platformSettings: Map<string, PlatformSettings> = new PersistentMap('platformSettings');
  public tenantSettings: Map<string, TenantSettings> = new PersistentMap('tenantSettings');
  public campusSettings: Map<string, CampusSettings> = new PersistentMap('campusSettings');
  public academicYearSettings: Map<string, AcademicYearSettings> = new PersistentMap('academicYearSettings');

  // People Domain Collections
  public staffMembers: Map<string, StaffMember> = new PersistentMap('staffMembers');
  public teacherProfiles: Map<string, TeacherProfile> = new PersistentMap('teacherProfiles');
  public studentProfiles: Map<string, StudentProfile> = new PersistentMap('studentProfiles');
  public guardianProfiles: Map<string, GuardianProfile> = new PersistentMap('guardianProfiles');
  public personRelationships: Map<string, PersonRelationship> = new PersistentMap('personRelationships');

  private constructor() {}

  public async initializePersistence(): Promise<void> {
    const collections: Record<string, Map<string, unknown>> = {};
    for (const [name, value] of Object.entries(this)) {
      if (value instanceof Map) collections[name] = value as Map<string, unknown>;
    }
    await initializePersistence(collections);
  }

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
